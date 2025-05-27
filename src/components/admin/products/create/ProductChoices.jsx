"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, ChevronsUpDown, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function ProductChoices({
  onChoicesUpdate,
  initialChoices = [],
}) {
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableValues, setAvailableValues] = useState({});
  const [choices, setChoices] = useState([
    {
      id: Date.now(),
      typeValuePairs: [],
      price: 0,
      quantity: 1,
    },
  ]);

  const [typeSelections, setTypeSelections] = useState({});
  const [valueSelections, setValueSelections] = useState({});
  const [colorSelections, setColorSelections] = useState({});

  const [openDropdowns, setOpenDropdowns] = useState({
    type: null,
    value: null,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialChoicesLoaded, setInitialChoicesLoaded] = useState(false);

  const handleTypeSelect = (choiceId, typeId) => {
    const numericId = Number(typeId);
    const typeObj = availableTypes.find((t) => t.id === numericId);

    if (!typeObj) {
      toast.error("Invalid type selection");
      return;
    }

    setTypeSelections({
      ...typeSelections,
      [choiceId]: numericId,
    });

    const newValueSelections = { ...valueSelections };
    delete newValueSelections[choiceId];
    setValueSelections(newValueSelections);

    const newColorSelections = { ...colorSelections };
    delete newColorSelections[choiceId];
    setColorSelections(newColorSelections);

    setOpenDropdowns({
      type: null,
      value: null,
    });
  };

  const handleValueSelect = (choiceId, valueId) => {
    const numericId = Number(valueId);
    const valueObj = availableValues[typeSelections[choiceId]]?.find(
      (v) => v.id === numericId
    );

    if (!valueObj) {
      toast.error("Invalid value selection");
      return;
    }

    setValueSelections({
      ...valueSelections,
      [choiceId]: numericId,
    });

    setOpenDropdowns({
      type: null,
      value: null,
    });
  };

  const handleColorChange = (choiceId, color) => {
    setColorSelections({
      ...colorSelections,
      [choiceId]: color,
    });
  };

  const isColorType = (typeId) => {
    const type = availableTypes.find((t) => t.id === typeId);
    return type && type.name.toLowerCase().includes("color");
  };

  const addTypeValuePair = (choiceId) => {
    const selectedType = typeSelections[choiceId];
    const selectedValue = valueSelections[choiceId];
    const selectedColor = colorSelections[choiceId];

    if (!selectedType || !selectedValue) {
      toast.warning("Please select both type and value");
      return;
    }

    if (isColorType(selectedType) && !selectedColor) {
      toast.warning("Please select a color");
      return;
    }

    setChoices(
      choices.map((choice) => {
        if (choice.id === choiceId) {
          const typeObj = availableTypes.find((t) => t.id === selectedType);
          const valueObj = availableValues[selectedType].find(
            (v) => v.id === selectedValue
          );

          const newPair = {
            typeId: selectedType,
            typeName: typeObj.name,
            valueId: selectedValue,
            value: valueObj.value,
            colorCode: isColorType(selectedType) ? selectedColor : null,
          };

          return {
            ...choice,
            typeValuePairs: [...choice.typeValuePairs, newPair],
          };
        }
        return choice;
      })
    );

    const newTypeSelections = { ...typeSelections };
    const newValueSelections = { ...valueSelections };
    const newColorSelections = { ...colorSelections };
    delete newTypeSelections[choiceId];
    delete newValueSelections[choiceId];
    delete newColorSelections[choiceId];
    setTypeSelections(newTypeSelections);
    setValueSelections(newValueSelections);
    setColorSelections(newColorSelections);
  };

  const removeTypeValuePair = (choiceId, typeId) => {
    setChoices(
      choices.map((choice) => {
        if (choice.id === choiceId) {
          return {
            ...choice,
            typeValuePairs: choice.typeValuePairs.filter(
              (pair) => pair.typeId !== typeId
            ),
          };
        }
        return choice;
      })
    );
  };

  const updatePrice = (choiceId, price) => {
    setChoices(
      choices.map((choice) => {
        if (choice.id === choiceId) {
          return { ...choice, price: parseFloat(price) || 0 };
        }
        return choice;
      })
    );
  };

  const updateQuantity = (choiceId, quantity) => {
    setChoices(
      choices.map((choice) => {
        if (choice.id === choiceId) {
          return { ...choice, quantity: parseInt(quantity) || 1 };
        }
        return choice;
      })
    );
  };

  const addChoice = () => {
    setChoices([
      ...choices,
      {
        id: Date.now(),
        typeValuePairs: [],
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const removeChoice = (choiceId) => {
    if (choices.length <= 1) {
      toast.warning("At least one choice is required");
      return;
    }

    setChoices(choices.filter((choice) => choice.id !== choiceId));
  };

  const isTypeUsedInChoice = (choiceId, typeId) => {
    const choice = choices.find((c) => c.id === choiceId);
    return choice?.typeValuePairs.some((pair) => pair.typeId === typeId);
  };

  const toggleTypeDropdown = (choiceId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      type: prev.type === choiceId ? null : choiceId,
      value: null,
    }));
  };

  const toggleValueDropdown = (choiceId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      value: prev.value === choiceId ? null : choiceId,
      type: null,
    }));
  };

  const performClearAll = () => {
    setChoices([
      {
        id: Date.now(),
        typeValuePairs: [],
        price: 0,
        quantity: 1,
      },
    ]);
    setTypeSelections({});
    setValueSelections({});
    setColorSelections({});
    toast.success("All choices cleared");

    if (onChoicesUpdate) {
      onChoicesUpdate([]);
    }
  };

  const hasUnsavedChanges = () => {
    return choices.some(
      (choice) =>
        choice.typeValuePairs.length > 0 ||
        choice.price > 0 ||
        choice.quantity !== 1
    );
  };

  useEffect(() => {
    if (choices.length === 0) {
      setTypeSelections({});
      setValueSelections({});
      setColorSelections({});
    }
  }, [choices]);

  useEffect(() => {
    if (!loading && onChoicesUpdate) {
      onChoicesUpdate(choices);
    }
  }, [choices, loading, onChoicesUpdate]);

  useEffect(() => {
    const fetchAvailableChoices = async () => {
      try {
        setLoading(true);

        // Fetch types
        const typesResponse = await fetch("http://localhost:8000/api/types");

        if (!typesResponse.ok) {
          throw new Error("Failed to fetch available types");
        }

        const typesData = await typesResponse.json();
        const types = typesData.data || [];
        setAvailableTypes(types);

        // Fetch values for each type
        const valuesObj = {};
        for (const type of types) {
          const valuesResponse = await fetch(
            `http://localhost:8000/api/types/${type.id}/values`
          );

          if (valuesResponse.ok) {
            const valuesData = await valuesResponse.json();
            valuesObj[type.id] = valuesData.data || [];
          }
        }

        setAvailableValues(valuesObj);
      } catch (error) {
        console.error("Error fetching available choices:", error);
        toast.error("Failed to load available options");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableChoices();
  }, []);

  // Initialize with any existing choices
  useEffect(() => {
    if (!loading && initialChoices.length > 0 && !initialChoicesLoaded) {
      if (initialChoices.length > 0) {
        // Transform initial choices to match our format if needed
        const formattedChoices = initialChoices.map((choice) => ({
          id: choice.id || Date.now() + Math.random(),
          typeValuePairs: choice.typeValuePairs || [],
          price: choice.price || 0,
          quantity: choice.quantity || 1,
        }));

        setChoices(formattedChoices);
        setInitialChoicesLoaded(true);
      }
    }
  }, [initialChoices, loading, initialChoicesLoaded]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading product choices...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={performClearAll}>Confirm</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Choices</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addChoice}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Choice
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (hasUnsavedChanges()) {
                setConfirmAction({
                  type: "clear",
                  title: "This will reset all choices to default. Continue?",
                });
                setShowConfirm(true);
              } else {
                performClearAll();
              }
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white"
            disabled={!hasUnsavedChanges()}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {choices.map((choice, choiceIndex) => (
          <div
            key={choice.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Choice {choiceIndex + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeChoice(choice.id)}
                disabled={choices.length <= 1}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Popover
                  open={openDropdowns.type === choice.id}
                  onOpenChange={() => toggleTypeDropdown(choice.id)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {typeSelections[choice.id]
                        ? availableTypes.find(
                            (t) => t.id === typeSelections[choice.id]
                          )?.name || "Select type"
                        : "Select type"}
                      <ChevronsUpDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search type..." />
                      <CommandList>
                        <CommandEmpty>No type found</CommandEmpty>
                        <CommandGroup>
                          {availableTypes.map((type) => (
                            <CommandItem
                              key={type.id}
                              onSelect={() =>
                                handleTypeSelect(choice.id, type.id)
                              }
                              disabled={isTypeUsedInChoice(choice.id, type.id)}
                            >
                              {type.name}
                              {typeSelections[choice.id] === type.id && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <Popover
                  open={openDropdowns.value === choice.id}
                  onOpenChange={() => toggleValueDropdown(choice.id)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={!typeSelections[choice.id]}
                    >
                      {valueSelections[choice.id] && typeSelections[choice.id]
                        ? availableValues[typeSelections[choice.id]]?.find(
                            (v) => v.id === valueSelections[choice.id]
                          )?.value || "Select value"
                        : "Select value"}
                      <ChevronsUpDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search value..." />
                      <CommandList>
                        <CommandEmpty>No value found</CommandEmpty>
                        <CommandGroup>
                          {typeSelections[choice.id] &&
                            availableValues[typeSelections[choice.id]]?.map(
                              (val) => (
                                <CommandItem
                                  key={val.id}
                                  onSelect={() =>
                                    handleValueSelect(choice.id, val.id)
                                  }
                                  disabled={choice.typeValuePairs.some(
                                    (pair) => pair.valueId === val.id
                                  )}
                                >
                                  {val.value}
                                  {valueSelections[choice.id] === val.id && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              )
                            )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Color Picker - Only visible when color type is selected */}
              {typeSelections[choice.id] &&
                isColorType(typeSelections[choice.id]) &&
                valueSelections[choice.id] && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color Code
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={colorSelections[choice.id] || "#000000"}
                        onChange={(e) =>
                          handleColorChange(choice.id, e.target.value)
                        }
                        className="w-12 h-10 p-1 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorSelections[choice.id] || ""}
                        onChange={(e) =>
                          handleColorChange(choice.id, e.target.value)
                        }
                        placeholder="#000000"
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                  </div>
                )}

              <Button
                onClick={() => addTypeValuePair(choice.id)}
                disabled={
                  !typeSelections[choice.id] ||
                  !valueSelections[choice.id] ||
                  (isColorType(typeSelections[choice.id]) &&
                    !colorSelections[choice.id])
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            </div>

            {choice.typeValuePairs.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Selected Options:</h4>
                <div className="flex flex-wrap gap-2">
                  {choice.typeValuePairs.map((pair) => (
                    <div
                      key={pair.typeId}
                      className="bg-gray-100 rounded-lg px-3 py-1 flex items-center gap-2"
                    >
                      <span className="text-sm font-medium">
                        {pair.typeName}:
                      </span>
                      <span className="text-sm">{pair.value}</span>
                      {pair.colorCode && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: pair.colorCode }}
                        />
                      )}
                      <button
                        onClick={() =>
                          removeTypeValuePair(choice.id, pair.typeId)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={choice.price}
                  onChange={(e) => updatePrice(choice.id, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={choice.quantity}
                  onChange={(e) => updateQuantity(choice.id, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
