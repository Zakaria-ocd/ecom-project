"use client";
import { useState, useEffect } from "react";
import OverviewTab from "./OverviewTab";
import SalesTab from "./SalesTab";
import ProductsTab from "./ProductsTab";
import CustomersTab from "./CustomersTab";

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

  // Fetch data from API endpoints
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch appropriate data based on the active tab
        if (tab === "overview" || tab === "sales") {
          const ordersResponse = await fetch(
            "http://localhost:8000/api/orders",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const ordersData = await ordersResponse.json();

          // Extract data from the response (handle both direct and nested formats)
          const orders = ordersData.data || ordersData;

          // Update data state with orders data
          setData((prevData) => ({
            ...prevData,
            overview: { ...prevData.overview, orders: orders },
            sales: orders,
          }));
        }

        // Fetch categories separately for better categorization
        const categoriesResponse = await fetch(
          "http://localhost:8000/api/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const categoriesData = await categoriesResponse.json();

        // Extract data from the response (handle both direct and nested formats)
        const categories = categoriesData.data || categoriesData;

        // Update data state with categories data
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const productsData = await productsResponse.json();

          // Extract data from the response (handle both direct and nested formats)
          const products = productsData.data || productsData;

          // Update data state with products data
          setData((prevData) => ({
            ...prevData,
            overview: { ...prevData.overview, products: products },
            products: products,
          }));
        }

        if (tab === "overview" || tab === "customers") {
          const usersResponse = await fetch("http://localhost:8000/api/users", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const usersData = await usersResponse.json();

          // Extract data from the response (handle both direct and nested formats)
          const users = usersData.data || usersData;

          // Update data state with users data
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

  // Process data based on period and tab
  useEffect(() => {
    if (loading) return;

    // Process data for all tabs
    const processed = {
      overview: processOverviewData(),
      sales: processSalesData(),
      products: processProductsData(),
      customers: processCustomersData(),
    };

    setProcessedData(processed);
  }, [data, period, loading]);

  // Process overview data
  const processOverviewData = () => {
    if (!data.overview) return {};

    const { orders, products, users } = data.overview;

    // Create appropriate time-based sales data based on selected period
    const salesData = processTimeBasedData(orders || []);

    // Process product categories using the fetched categories
    const productCategoryData = processProductCategories(
      products || [],
      data.categories || []
    );

    // Process user roles
    const userRoleData = processUserRoles(users || []);

    // Process recent orders by status
    const recentOrdersData = processRecentOrders(orders || []);

    return {
      salesData,
      productCategoryData,
      userRoleData,
      recentOrdersData,
    };
  };

  // Process sales data
  const processSalesData = () => {
    if (!data.sales) return {};

    // Monthly sales data with comparison to previous year
    const monthlySalesData = processMonthlyComparisonData(data.sales);

    // Weekly sales data
    const weeklySalesData = processWeeklySalesData(data.sales);

    // Top selling products
    const topSellingProducts = processTopSellingProducts(data.sales);

    return {
      monthlySalesData,
      weeklySalesData,
      topSellingProducts,
    };
  };

  // Process products data
  const processProductsData = () => {
    if (!data.products) return {};

    // Category distribution using the dedicated categories data
    const categoryDistribution = processProductCategories(
      data.products,
      data.categories || []
    );

    // Inventory status
    const inventoryStatus = processInventoryStatus(data.products);

    // Product performance analysis
    const productPerformance = processProductPerformance(data.products);

    return {
      categoryDistribution,
      inventoryStatus,
      productPerformance,
    };
  };

  // Process customers data
  const processCustomersData = () => {
    if (!data.customers) return {};

    // User registrations over time
    const userRegistrations = processUserRegistrations(data.customers);

    // User role distribution
    const userRoleDistribution = processUserRoles(data.customers);

    // User demographics
    const userDemographics = processUserDemographics(data.customers);

    // Purchase frequency
    const purchaseFrequency = processPurchaseFrequency(data.customers);

    return {
      userRegistrations,
      userRoleDistribution,
      userDemographics,
      purchaseFrequency,
    };
  };

  // Helper function to process data based on selected time period
  const processTimeBasedData = (orders) => {
    // Filter orders based on selected period
    const filteredOrders = filterDataByPeriod(orders);

    // Prepare data structure based on period
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

  // Process data by hours (for day period)
  const processDailyData = (orders) => {
    const hours = Array(24)
      .fill(0)
      .map((_, i) => ({
        name: `${i}:00`,
        value: 0,
      }));

    // Calculate total sales per hour
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

  // Process data by days (for week period)
  const processWeeklyData = (orders) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekData = days.map((day) => ({ name: day, value: 0 }));

    // Calculate total sales per day of week
    orders.forEach((order) => {
      try {
        const date = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to 0 = Monday, 6 = Sunday
          weekData[adjustedIndex].value += parseFloat(order.total_price || 0);
        }
      } catch (error) {
        console.error("Error processing order date for weekly data:", error);
      }
    });

    return weekData;
  };

  // Process data for last 30 days (for month period)
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

    // Calculate total sales per day
    orders.forEach((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(orderDate.getTime())) {
          // Find index by calculating days difference
          const daysDiff = Math.floor(
            (today - orderDate) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff >= 0 && daysDiff < 30) {
            const index = 29 - daysDiff; // Reverse index (29 = today, 0 = 29 days ago)
            daysData[index].value += parseFloat(order.total_price || 0);
          }
        }
      } catch (error) {
        console.error("Error processing order date for monthly data:", error);
      }
    });

    return daysData;
  };

  // Helper functions for data processing
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

    // Calculate total sales per month
    orders.forEach((order) => {
      try {
        const date = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(date.getTime())) {
          // Check if date is valid
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

    // Get only orders from the last 7 days
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

    // Categorize orders by status and day
    recentOrders.forEach((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(orderDate.getTime())) {
          // Check if date is valid
          const dayIndex = orderDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to 0 = Monday, 6 = Sunday

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
    // Start with categories from the API if available
    const categoryData = {};

    // Initialize with the categories from the API
    categories.forEach((category) => {
      categoryData[category.name || "Uncategorized"] = 0;
    });

    // If no categories from API, add Uncategorized
    if (Object.keys(categoryData).length === 0) {
      categoryData["Uncategorized"] = 0;
    }

    // Count products by category
    products.forEach((product) => {
      // Get the category ID from the product and convert to number for comparison
      const productCategoryId = product.category_id
        ? parseInt(product.category_id)
        : null;

      // Find the matching category by ID
      const matchingCategory = categories.find(
        (category) => category.id === productCategoryId
      );
      const categoryName = matchingCategory?.name || "Uncategorized";

      if (!categoryData[categoryName]) {
        categoryData[categoryName] = 0;
      }
      categoryData[categoryName]++;
    });

    // Convert to array format for charts
    return Object.entries(categoryData)
      .filter(([_, count]) => count > 0) // Only include categories with products
      .map(([name, value]) => ({ name, value }));
  };

  const processUserRoles = (users) => {
    // Count users by role
    const roles = { admin: 0, seller: 0, buyer: 0 };

    users.forEach((user) => {
      const role = user.role || "buyer";
      if (roles[role] !== undefined) {
        roles[role]++;
      }
    });

    // Convert to array format for charts
    return Object.entries(roles)
      .filter(([_, value]) => value > 0) // Only include roles with users
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
          // Check if date is valid
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

    // Filter orders based on period
    let filteredOrders = [];

    try {
      if (period === "day") {
        // Last 24 hours
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
        // Default to week
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

    // Calculate revenue and count orders per day
    filteredOrders.forEach((order) => {
      try {
        const orderDate = new Date(
          order.created_at || order.updated_at || new Date()
        );
        if (!isNaN(orderDate.getTime())) {
          // Check if date is valid
          const dayIndex = orderDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to 0 = Monday, 6 = Sunday

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

    // Collect data from order items
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

    // Convert to array and sort by sales
    const sortedProducts = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Get top 5

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

    // Categorize products by stock level
    products.forEach((product) => {
      // Check if product has choices with quantity
      const hasChoices = product.choices && product.choices.length > 0;
      let totalQuantity = 0;

      if (hasChoices) {
        // Sum up quantities from all choices
        product.choices.forEach((choice) => {
          totalQuantity += parseInt(choice.quantity || 0);
        });
      } else {
        // Use product stock_quantity
        totalQuantity = parseInt(product.stock_quantity || 0);
      }

      // Categorize based on quantity
      if (totalQuantity === 0) {
        stockStatus["Out of Stock"]++;
      } else if (totalQuantity < 10) {
        stockStatus["Low Stock"]++;
      } else {
        stockStatus["In Stock"]++;
      }
    });

    // Convert to array format for charts
    return Object.entries(stockStatus).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const processProductPerformance = (products) => {
    // Create scatter plot data for products
    return products.slice(0, 10).map((product) => {
      // Calculate basic metrics for each product
      const sales = product.total_sales || Math.floor(Math.random() * 200) + 50; // Fallback to random
      const revenue = parseFloat(product.price || 0) * sales;
      const stock = parseInt(product.stock_quantity || 0);

      return {
        name: product.name || `Product ${product.id}`,
        x: sales, // sales volume
        y: revenue, // revenue
        z: stock + 100, // stock level (add 100 to ensure visibility)
      };
    });
  };

  const processUserRegistrations = (users) => {
    // Based on the selected period, generate appropriate time data
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

    // Last 24 hours only
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
      month: day, // keeping the prop name as 'month' for compatibility
      registrations: 0,
    }));

    // Last 7 days only
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
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to 0 = Monday, 6 = Sunday
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

    // Last 30 days only
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
          // Find index by calculating days difference
          const daysDiff = Math.floor(
            (today - createDate) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff >= 0 && daysDiff < 30) {
            const index = 29 - daysDiff; // Reverse index (29 = today, 0 = 29 days ago)
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

    // Filter users based on selected period
    const filteredUsers = filterDataByPeriod(users);

    // Count registrations per month
    filteredUsers.forEach((user) => {
      try {
        const createDate = new Date(user.created_at || new Date());
        if (!isNaN(createDate.getTime())) {
          // Check if date is valid
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
    // Create role-based data for the radar chart
    const roleGroups = [
      { subject: "admin", A: 0, fullMark: 150 },
      { subject: "seller", A: 0, fullMark: 150 },
      { subject: "buyer", A: 0, fullMark: 150 },
    ];

    // Count users by role
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
    // We need orders data to determine purchase frequency
    const frequencyData = [
      { name: "first-time", value: 0 },
      { name: "occasional", value: 0 },
      { name: "regular", value: 0 },
      { name: "frequent", value: 0 },
    ];

    // Count users by their order_count property or metadata
    users.forEach((user) => {
      // Try to get order count from user data
      const orderCount =
        user.order_count || (user.orders ? user.orders.length : 0);

      if (orderCount === 0) {
        // No purchases
        return; // Don't count users with no purchases
      } else if (orderCount === 1) {
        // First-time buyers
        frequencyData[0].value++;
      } else if (orderCount >= 2 && orderCount <= 3) {
        // Occasional buyers (2-3 orders)
        frequencyData[1].value++;
      } else if (orderCount >= 4 && orderCount <= 10) {
        // Regular buyers (4-10 orders)
        frequencyData[2].value++;
      } else {
        // Frequent buyers (11+ orders)
        frequencyData[3].value++;
      }
    });

    // Filter out empty categories
    return frequencyData.filter((item) => item.value > 0);
  };

  // Filter data based on selected period
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
        cutoffDate.setDate(now.getDate() - 7); // Default to week
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

  // Render the appropriate tab based on the selection
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
