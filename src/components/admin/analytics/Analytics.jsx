"use client";
import { useState, useEffect } from "react";
import OverviewTab from "./OverviewTab";
import SalesTab from "./SalesTab";
import ProductsTab from "./ProductsTab";
import CustomersTab from "./CustomersTab";
import { getAuthToken } from "@/lib/auth";

export default function Analytics({ tab, period }) {
  const [data, setData] = useState({
    overview: null,
    sales: null,
    products: null,
    customers: null,
    categories: null,
  });
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState({
    overview: {},
    sales: {},
    products: {},
    customers: {},
  });
  const token = getAuthToken();

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        
        if (tab === "overview" || tab === "sales") {
          const ordersResponse = await fetch(
            "http://localhost:8000/api/orders",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const ordersData = await ordersResponse.json();

          
          const orders = ordersData.data || ordersData;

          
          setData((prevData) => ({
            ...prevData,
            overview: { ...prevData.overview, orders: orders },
            sales: orders,
          }));
        }

        
        const categoriesResponse = await fetch(
          "http://localhost:8000/api/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const categoriesData = await categoriesResponse.json();

        
        const categories = categoriesData.data || categoriesData;

        
        setData((prevData) => ({
          ...prevData,
          categories: categories,
        }));

        if (tab === "overview" || tab === "products") {
          const productsResponse = await fetch(
            "http://localhost:8000/api/products",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const productsData = await productsResponse.json();

          
          const products = productsData.data || productsData;

          
          const productsWithChoices = await Promise.all(
            products.map(async (product) => {
              try {
                const choicesResponse = await fetch(
                  `http://localhost:8000/api/products/${product.id}/choices`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (choicesResponse.ok) {
                  const choicesData = await choicesResponse.json();
                  const choices = choicesData.data || choicesData;
                  return { ...product, choices: choices };
                }

                return product;
              } catch (error) {
                console.error(
                  `Error fetching choices for product ${product.id}:`,
                  error
                );
                return product;
              }
            })
          );

          
          setData((prevData) => ({
            ...prevData,
            overview: { ...prevData.overview, products: productsWithChoices },
            products: productsWithChoices,
          }));
        }

        if (tab === "overview" || tab === "customers") {
          const usersResponse = await fetch("http://localhost:8000/api/users", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const usersData = await usersResponse.json();

          
          const users = usersData.data || usersData;

          
          setData((prevData) => ({
            ...prevData,
            overview: { ...prevData.overview, users: users },
            customers: users,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [tab]);

  
  useEffect(() => {
    if (loading) return;

    
    const processed = {
      overview: processOverviewData(),
      sales: processSalesData(),
      products: processProductsData(),
      customers: processCustomersData(),
    };

    setProcessedData(processed);
    
  }, [data, period, loading]);

  
  const processOverviewData = () => {
    if (!data.overview) return {};

    const { orders, products, users } = data.overview;

    
    const salesData = processTimeBasedData(orders || []);

    
    const productCategoryData = processProductCategories(
      products || [],
      data.categories || []
    );

    
    const userRoleData = processUserRoles(users || []);

    
    const recentOrdersData = processRecentOrders(orders || []);

    return {
      salesData,
      productCategoryData,
      userRoleData,
      recentOrdersData,
    };
  };

  
  const processSalesData = () => {
    if (!data.sales) return {};

    
    const monthlySalesData = processMonthlyComparisonData(data.sales);

    
    const weeklySalesData = processWeeklySalesData(data.sales);

    
    const topSellingProducts = processTopSellingProducts(data.sales);

    return {
      monthlySalesData,
      weeklySalesData,
      topSellingProducts,
    };
  };

  
  const processProductsData = () => {
    if (!data.products) return {};

    
    const categoryDistribution = processProductCategories(
      data.products,
      data.categories || []
    );

    
    const inventoryStatus = processInventoryStatus(data.products);

    
    const topProductsByCategory = processTopProductsByCategory(
      data.products,
      data.categories || []
    );

    return {
      categoryDistribution,
      inventoryStatus,
      topProductsByCategory,
    };
  };

  
  const processCustomersData = () => {
    if (!data.customers) return {};

    
    const userRegistrations = processUserRegistrations(data.customers);

    
    const userRoleDistribution = processUserRoles(data.customers);

    
    const userDemographics = processUserDemographics(data.customers);

    
    const purchaseFrequency = processPurchaseFrequency(data.customers);

    return {
      userRegistrations,
      userRoleDistribution,
      userDemographics,
      purchaseFrequency,
    };
  };

  
  const processTimeBasedData = (orders) => {
    
    const filteredOrders = filterDataByPeriod(orders);

    
    switch (period) {
      case "day":
        return processDailyData(filteredOrders);
      case "week":
        return processWeeklyData(filteredOrders);
      case "month":
        return processLast30DaysData(filteredOrders);
      case "year":
      default:
        return processMonthlyData(filteredOrders);
    }
  };

  
  const processDailyData = (orders) => {
    const hours = Array(24)
      .fill(0)
      .map((_, i) => ({
        name: `${i}:00`,
        value: 0,
      }));

    
    orders.forEach((order) => {
      try {
        const date = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(date.getTime())) {
          const hourIndex = date.getHours();
          hours[hourIndex].value += parseFloat(order.total_price || 0);
        }
      } catch (error) {
        console.error("Error processing order date for hourly data:", error);
      }
    });

    return hours;
  };

  
  const processWeeklyData = (orders) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekData = days.map((day) => ({ name: day, value: 0 }));

    
    orders.forEach((order) => {
      try {
        const date = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
          weekData[adjustedIndex].value += parseFloat(order.total_price || 0);
        }
      } catch (error) {
        console.error("Error processing order date for weekly data:", error);
      }
    });

    return weekData;
  };

  
  const processLast30DaysData = (orders) => {
    const today = new Date();
    const daysData = Array(30)
      .fill(0)
      .map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - 29 + i);
        return {
          name: `${date.getDate()}/${date.getMonth() + 1}`,
          value: 0,
        };
      });

    
    orders.forEach((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(orderDate.getTime())) {
          
          const daysDiff = Math.floor(
            (today - orderDate) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff >= 0 && daysDiff < 30) {
            const index = 29 - daysDiff; 
            daysData[index].value += parseFloat(order.total_price || 0);
          }
        }
      } catch (error) {
        console.error("Error processing order date for monthly data:", error);
      }
    });

    return daysData;
  };

  
  const processMonthlyData = (orders) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = Array(12)
      .fill(0)
      .map((_, i) => ({ name: months[i], value: 0 }));

    
    orders.forEach((order) => {
      try {
        const date = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(date.getTime())) {
          
          const monthIndex = date.getMonth();
          monthlyData[monthIndex].value += parseFloat(order.total_price || 0);
        }
      } catch (error) {
        console.error("Error processing order date:", error);
      }
    });

    return monthlyData;
  };

  const processRecentOrders = (orders) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const ordersData = days.map((day) => ({
      name: day,
      pending: 0,
      shipped: 0,
      delivered: 0,
    }));

    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentOrders = orders.filter((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        return !isNaN(orderDate.getTime()) && orderDate >= oneWeekAgo;
      } catch (error) {
        return false;
      }
    });

    
    recentOrders.forEach((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(orderDate.getTime())) {
          
          const dayIndex = orderDate.getDay(); 
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; 

          const status = order.status?.toLowerCase() || "pending";
          if (status === "pending") ordersData[adjustedIndex].pending++;
          else if (status === "shipped") ordersData[adjustedIndex].shipped++;
          else if (status === "delivered")
            ordersData[adjustedIndex].delivered++;
        }
      } catch (error) {
        console.error("Error processing order date for status:", error);
      }
    });

    return ordersData;
  };

  const processProductCategories = (products, categories) => {
    
    const categoryData = {};

    
    categories.forEach((category) => {
      categoryData[category.name || "Uncategorized"] = 0;
    });

    
    if (Object.keys(categoryData).length === 0) {
      categoryData["Uncategorized"] = 0;
    }

    
    products.forEach((product) => {
      
      const productCategoryId = product.category_id
        ? parseInt(product.category_id)
        : null;

      
      const matchingCategory = categories.find(
        (category) => category.id === productCategoryId
      );
      const categoryName = matchingCategory?.name || "Uncategorized";

      if (!categoryData[categoryName]) {
        categoryData[categoryName] = 0;
      }
      categoryData[categoryName]++;
    });

    
    return Object.entries(categoryData)
      .filter(([_, count]) => count > 0) 
      .map(([name, value]) => ({ name, value }));
  };

  const processUserRoles = (users) => {
    
    const roles = { admin: 0, seller: 0, buyer: 0 };

    users.forEach((user) => {
      const role = user.role || "buyer";
      if (roles[role] !== undefined) {
        roles[role]++;
      }
    });

    
    return Object.entries(roles)
      .filter(([_, value]) => value > 0) 
      .map(([name, value]) => ({ name, value }));
  };

  const processMonthlyComparisonData = (orders) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlySales = Array(12)
      .fill(0)
      .map((_, i) => ({
        name: months[i],
        revenue: 0,
        previousYear: 0,
      }));

    const currentYear = new Date().getFullYear();

    orders.forEach((order) => {
      try {
        const date = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(date.getTime())) {
          
          const month = date.getMonth();
          const year = date.getFullYear();

          if (year === currentYear) {
            monthlySales[month].revenue += parseFloat(order.total_price || 0);
          } else if (year === currentYear - 1) {
            monthlySales[month].previousYear += parseFloat(
              order.total_price || 0
            );
          }
        }
      } catch (error) {
        console.error(
          "Error processing order date for monthly comparison:",
          error
        );
      }
    });

    return monthlySales;
  };

  const processWeeklySalesData = (orders) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklySales = days.map((day) => ({ day, revenue: 0, orders: 0 }));

    
    let filteredOrders = [];

    try {
      if (period === "day") {
        
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        filteredOrders = orders.filter((order) => {
          try {
            const orderDate = new Date(
              order.created_at || order.updated_at || new Date()
            );
            return !isNaN(orderDate.getTime()) && orderDate >= oneDayAgo;
          } catch (error) {
            return false;
          }
        });
      } else {
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredOrders = orders.filter((order) => {
          try {
            const orderDate = new Date(
              order.created_at || order.updated_at || new Date()
            );
            return !isNaN(orderDate.getTime()) && orderDate >= oneWeekAgo;
          } catch (error) {
            return false;
          }
        });
      }
    } catch (error) {
      console.error("Error filtering orders by period:", error);
    }

    
    filteredOrders.forEach((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(orderDate.getTime())) {
          
          const dayIndex = orderDate.getDay(); 
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; 

          weeklySales[adjustedIndex].revenue += parseFloat(
            order.total_price || 0
          );
          weeklySales[adjustedIndex].orders += 1;
        }
      } catch (error) {
        console.error("Error processing order date for weekly sales:", error);
      }
    });

    return weeklySales;
  };

  const processTopSellingProducts = (orders) => {
    const productSales = {};

    
    orders.forEach((order) => {
      const items = order.items || [];
      items.forEach((item) => {
        const productName = item.product?.name || `Product ${item.product_id}`;
        if (!productSales[productName]) {
          productSales[productName] = 0;
        }
        productSales[productName] += parseInt(item.quantity || 1);
      });
    });

    
    const sortedProducts = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); 

    return sortedProducts.length > 0
      ? sortedProducts
      : [{ name: "No Products", sales: 0 }];
  };

  const processInventoryStatus = (products) => {
    const stockStatus = {
      "In Stock": 0,
      "Low Stock": 0,
      "Out of Stock": 0,
    };

    
    products.forEach((product) => {
      
      const hasChoices =
        Array.isArray(product.choices) && product.choices.length > 0;
      let totalQuantity = 0;

      if (hasChoices) {
        
        product.choices.forEach((choice) => {
          
          const choiceQuantity = parseInt(choice.quantity || 0);
          totalQuantity += choiceQuantity;

          
          if (
            Array.isArray(choice.variations) &&
            choice.variations.length > 0
          ) {
            choice.variations.forEach((variation) => {
              totalQuantity += parseInt(variation.quantity || 0);
            });
          }
        });
      } else {
        
        totalQuantity = parseInt(product.stock_quantity || 0);
      }

      
      console.log(
        `Product ${
          product.name || product.id
        }: Total quantity = ${totalQuantity}`
      );

      
      if (totalQuantity <= 0) {
        stockStatus["Out of Stock"]++;
      } else if (totalQuantity < 10) {
        stockStatus["Low Stock"]++;
      } else {
        stockStatus["In Stock"]++;
      }
    });

    
    return Object.entries(stockStatus).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const processTopProductsByCategory = (products, categories) => {
    
    const categoryNames = {};
    categories.forEach((category) => {
      categoryNames[category.id] = category.name || "Uncategorized";
    });

    
    const productsByCategory = {};

    products.forEach((product) => {
      const categoryId = product.category_id;
      const categoryName = categoryNames[categoryId] || "Uncategorized";

      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }

      
      let totalStock = 0;
      const hasChoices =
        Array.isArray(product.choices) && product.choices.length > 0;

      
      let productPrice = parseFloat(product.price || 0);
      let priceSource = "base";

      if (hasChoices && product.choices.length > 0) {
        
        const firstChoice = product.choices[0];
        if (firstChoice && firstChoice.price) {
          productPrice = parseFloat(firstChoice.price);
          priceSource = "choice";
        }

        
        product.choices.forEach((choice) => {
          
          totalStock += parseInt(choice.quantity || 0);

          
          if (
            Array.isArray(choice.variations) &&
            choice.variations.length > 0
          ) {
            choice.variations.forEach((variation) => {
              totalStock += parseInt(variation.quantity || 0);
            });
          }
        });

        
        console.log(
          `Category ${categoryName}, Product ${product.name}: ${product.choices.length} choices, total stock: ${totalStock}, price: ${productPrice} (${priceSource})`
        );
      } else {
        totalStock = parseInt(product.stock_quantity || 0);
        console.log(
          `Category ${categoryName}, Product ${product.name}: No choices, stock: ${totalStock}, price: ${productPrice} (${priceSource})`
        );
      }

      productsByCategory[categoryName].push({
        name: product.name || `Product ${product.id}`,
        price: productPrice,
        stock: totalStock,
        views: product.views || 0,
        rating: parseFloat(product.rating || 0),
      });
    });

    
    const result = [];
    Object.entries(productsByCategory).forEach(([category, prods]) => {
      
      const topByPrice = [...prods]
        .sort((a, b) => b.price - a.price)
        .slice(0, 2);

      topByPrice.forEach((product) => {
        result.push({
          category,
          name: product.name,
          price: product.price,
          stock: product.stock,
          views: product.views,
          rating: product.rating,
        });
      });
    });

    
    return result.sort((a, b) => b.price - a.price).slice(0, 10);
  };

  const processUserRegistrations = (users) => {
    
    switch (period) {
      case "day":
        return processUserRegistrationsHourly(users);
      case "week":
        return processUserRegistrationsDaily(users);
      case "month":
        return processUserRegistrations30Days(users);
      case "year":
      default:
        return processUserRegistrationsMonthly(users);
    }
  };

  const processUserRegistrationsHourly = (users) => {
    const hours = Array(24)
      .fill(0)
      .map((_, i) => ({
        month: `${i}:00`,
        registrations: 0,
      }));

    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentUsers = users.filter((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        return !isNaN(createDate.getTime()) && createDate >= oneDayAgo;
      } catch (error) {
        return false;
      }
    });

    recentUsers.forEach((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        if (!isNaN(createDate.getTime())) {
          const hourIndex = createDate.getHours();
          hours[hourIndex].registrations++;
        }
      } catch (error) {
        console.error("Error processing user registration date:", error);
      }
    });

    return hours;
  };

  const processUserRegistrationsDaily = (users) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyData = days.map((day) => ({
      month: day, 
      registrations: 0,
    }));

    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentUsers = users.filter((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        return !isNaN(createDate.getTime()) && createDate >= oneWeekAgo;
      } catch (error) {
        return false;
      }
    });

    recentUsers.forEach((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        if (!isNaN(createDate.getTime())) {
          const dayIndex = createDate.getDay();
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
          dailyData[adjustedIndex].registrations++;
        }
      } catch (error) {
        console.error("Error processing user registration date:", error);
      }
    });

    return dailyData;
  };

  const processUserRegistrations30Days = (users) => {
    const today = new Date();
    const daysData = Array(30)
      .fill(0)
      .map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - 29 + i);
        return {
          month: `${date.getDate()}/${date.getMonth() + 1}`,
          registrations: 0,
        };
      });

    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = users.filter((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        return !isNaN(createDate.getTime()) && createDate >= thirtyDaysAgo;
      } catch (error) {
        return false;
      }
    });

    recentUsers.forEach((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        if (!isNaN(createDate.getTime())) {
          
          const daysDiff = Math.floor(
            (today - createDate) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff >= 0 && daysDiff < 30) {
            const index = 29 - daysDiff; 
            daysData[index].registrations++;
          }
        }
      } catch (error) {
        console.error("Error processing user registration date:", error);
      }
    });

    return daysData;
  };

  const processUserRegistrationsMonthly = (users) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const registrations = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: months[i],
        registrations: 0,
      }));

    
    const filteredUsers = filterDataByPeriod(users);

    
    filteredUsers.forEach((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        if (!isNaN(createDate.getTime())) {
          
          const monthIndex = createDate.getMonth();
          registrations[monthIndex].registrations++;
        }
      } catch (error) {
        console.error("Error processing user registration date:", error);
      }
    });

    return registrations;
  };

  const processUserDemographics = (users) => {
    
    const roleGroups = [
      { subject: "admin", A: 0, fullMark: 150 },
      { subject: "seller", A: 0, fullMark: 150 },
      { subject: "buyer", A: 0, fullMark: 150 },
    ];

    
    users.forEach((user) => {
      const role = user.role || "buyer";
      if (role === "admin") {
        roleGroups[0].A++;
      } else if (role === "seller") {
        roleGroups[1].A++;
      } else {
        roleGroups[2].A++;
      }
    });

    return roleGroups;
  };

  const processPurchaseFrequency = (users) => {
    
    const frequencyData = [
      { name: "First Time", value: 0 },
      { name: "Occasional", value: 0 },
      { name: "Regular", value: 0 },
      { name: "VIP", value: 0 },
    ];

    
    users.forEach((user) => {
      
      const orderCount =
        user.order_count ||
        (Array.isArray(user.orders) ? user.orders.length : 0) ||
        0;

      if (orderCount === 1) {
        
        frequencyData[0].value++;
      } else if (orderCount >= 2 && orderCount <= 4) {
        
        frequencyData[1].value++;
      } else if (orderCount >= 5 && orderCount <= 10) {
        
        frequencyData[2].value++;
      } else if (orderCount > 10) {
        
        frequencyData[3].value++;
      }
    });

    
    if (frequencyData.every((item) => item.value === 0)) {
      frequencyData[0].value = 1; 
    }

    return frequencyData;
  };

  
  const filterDataByPeriod = (dataArray) => {
    if (!dataArray || !dataArray.length) return [];

    const now = new Date();
    let cutoffDate = new Date();

    switch (period) {
      case "day":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 7); 
    }

    return dataArray.filter((item) => {
      try {
        const dateStr = item.created_at || item.updated_at;
        if (!dateStr) return false;

        const itemDate = new Date(dateStr);
        return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
      } catch (error) {
        console.error("Error filtering item by date:", error);
        return false;
      }
    });
  };

  
  const renderTab = () => {
    switch (tab) {
      case "overview":
        return (
          <OverviewTab
            data={processedData.overview}
            period={period}
            loading={loading}
          />
        );
      case "sales":
        return (
          <SalesTab
            data={processedData.sales}
            period={period}
            loading={loading}
          />
        );
      case "products":
        return (
          <ProductsTab
            data={processedData.products}
            period={period}
            loading={loading}
          />
        );
      case "customers":
        return (
          <CustomersTab
            data={processedData.customers}
            period={period}
            loading={loading}
          />
        );
      default:
        return (
          <OverviewTab
            data={processedData.overview}
            period={period}
            loading={loading}
          />
        );
    }
  };

  return <div className="w-full">{renderTab()}</div>;
}
