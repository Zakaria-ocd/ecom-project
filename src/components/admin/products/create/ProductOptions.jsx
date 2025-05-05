"use client";

import { useEffect, useState } from "react";
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
import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TbTrashX } from "react-icons/tb";
import { toast } from "sonner";

export default function ProductOptions({
  onOptionsUpdate,
  productData,
  setProductData,
}) {
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([
    { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
  ]);
  const [hasNoOptions, setHasNoOptions] = useState(true);
  const [hasNoOptionsInputs, setHasNoOptionsInput] = useState({
    price: 0.0,
    quantity: 1,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    option: null,
    value: null,
  });

  const getValuesByOptionId = (optionId) =>
    optionValues.filter((v) => v.option_id === optionId);

  const hasUnsavedChanges = () => {
    if (hasNoOptions)
      return (
        hasNoOptionsInputs.price !== 0 || hasNoOptionsInputs.quantity !== 1
      );
    return selectedOptions.some(
      (opt) =>
        opt.option ||
        opt.values.some((v) => v.value || v.price > 0 || v.quantity !== 1)
    );
  };

  const callOnOptionsUpdate = (updatedOptions = selectedOptions) => {
    const optionsArray = Array.isArray(updatedOptions)
      ? updatedOptions
      : selectedOptions;

    onOptionsUpdate({
      hasNoOptions,
      selectedOptions: optionsArray.map((opt) => ({
        option_id: opt.option?.id || null,
        values: opt.values
          .filter((val) => val.value !== null)
          .map((val) => ({
            option_value_id: val.value?.id || null,
            price: val.price,
            quantity: val.quantity,
          })),
      })),
      hasNoOptionsInputs,
    });
  };

  const handleAddOption = () => {
    if (selectedOptions.length >= options.length) {
      toast.warning("Maximum options reached");
      return;
    }
    if (hasNoOptions) {
      if (hasNoOptionsInputs.price !== 0 || hasNoOptionsInputs.quantity !== 1) {
        setConfirmAction({
          type: "hasOptions",
          title:
            "Switching will discard the current price and quantity. Continue?",
        });
        setShowConfirm(true);
      } else {
        setHasNoOptionsInput({ price: 0.0, quantity: 1 });
        setHasNoOptions(false);
      }
    } else {
      setSelectedOptions((prev) => [
        ...prev,
        { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
      ]);
      callOnOptionsUpdate();
    }
  };

  const handleRemoveOption = (idx) => {
    if (selectedOptions.length <= 1) return;
    setSelectedOptions((prev) => prev.filter((_, i) => i !== idx));
    callOnOptionsUpdate();
  };

  const handleAddValue = (optIdx) => {
    const section = selectedOptions[optIdx];
    const lastValue = section.values[section.values.length - 1];
    if (!lastValue?.value || lastValue?.price <= 0) {
      toast.warning(
        "Please complete the current value before adding a new one"
      );
      return;
    }
    const maxValues = getValuesByOptionId(section.option?.id).length;
    if (section.values.length >= maxValues) {
      toast.warning(`Maximum of ${maxValues} values allowed`);
      return;
    }
    setSelectedOptions((prev) =>
      prev.map((opt, i) =>
        i === optIdx
          ? {
              ...opt,
              values: [...opt.values, { value: null, price: 0, quantity: 1 }],
            }
          : opt
      )
    );
    callOnOptionsUpdate();
  };

  const handleRemoveValue = (optIdx, valIdx) => {
    setSelectedOptions((prev) =>
      prev.map((opt, i) =>
        i === optIdx
          ? { ...opt, values: opt.values.filter((_, j) => j !== valIdx) }
          : opt
      )
    );
    callOnOptionsUpdate();
  };

  const handleSelectOption = (idx, optId) => {
    const numericId = Number(optId);
    const opt = options.find((o) => o.id === numericId);

    if (!opt) {
      toast.error("Invalid option selection");
      return;
    }

    const updatedOptions = selectedOptions.map((item, i) =>
      i === idx
        ? {
            ...item,
            option: opt,
            values: [{ value: null, price: 0, quantity: 1 }],
          }
        : item
    );

    setSelectedOptions(updatedOptions);
    callOnOptionsUpdate(updatedOptions);
  };

  const handleSelectValue = (optIdx, valIdx, valId) => {
    const numericId = Number(valId);
    const val = optionValues.find((v) => v.id === numericId);

    if (!val) {
      toast.error("Invalid value selection");
      return;
    }

    const updatedOptions = selectedOptions.map((opt, i) =>
      i === optIdx
        ? {
            ...opt,
            values: opt.values.map((v, j) =>
              j === valIdx ? { ...v, value: val } : v
            ),
          }
        : opt
    );

    setSelectedOptions(updatedOptions);
    callOnOptionsUpdate(updatedOptions);
  };

  const performClearAll = () => {
    if (hasNoOptions) {
      setHasNoOptionsInput({ price: 0.0, quantity: 1 });
      toast.success("All inputs cleared");
    } else {
      setSelectedOptions([
        { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
      ]);
      toast.success("All options cleared");
    }
    callOnOptionsUpdate();
  };

  const performHasOptions = () => {
    setSelectedOptions([
      { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
    ]);
    setHasNoOptionsInput({ price: 0.0, quantity: 1 });
    setHasNoOptions(false);
    callOnOptionsUpdate();
    toast.success("Switched to options mode");
  };

  const performHasNoOptions = () => {
    setSelectedOptions([
      { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
    ]);
    setHasNoOptions(true);
    setHasNoOptionsInput({ price: 0.0, quantity: 1 });
    setProductData((prev) => ({
      ...prev,
      price: 0,
      quantity: 1,
    }));
    onOptionsUpdate({
      hasNoOptions: true,
      selectedOptions: [
        { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
      ],
      hasNoOptionsInputs: { price: 0.0, quantity: 1 },
    });
    toast.success("Switched to no options mode");
  };

  const toggleOptionDropdown = (index) => {
    setOpenDropdowns((prev) =>
      prev.option === index
        ? { ...prev, option: null, value: null }
        : { ...prev, option: index, value: null }
    );
  };

  const toggleValueDropdown = (optIndex, valIndex) => {
    const key = `${optIndex}-${valIndex}`;
    setOpenDropdowns((prev) =>
      prev.value === key
        ? { ...prev, value: null, option: null }
        : { ...prev, value: key, option: null }
    );
  };

  const handleConfirmAction = () => {
    switch (confirmAction?.type) {
      case "clear":
        performClearAll();
        break;
      case "hasNoOptions":
        performHasNoOptions();
        break;
      case "hasOptions":
        performHasOptions();
        break;
    }
    setShowConfirm(false);
  };

  useEffect(() => {
    callOnOptionsUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [optionsRes, valuesRes] = await Promise.all([
          fetch("http://localhost:8000/api/options"),
          fetch("http://localhost:8000/api/optionValues"),
        ]);
        if (!optionsRes.ok || !valuesRes.ok)
          throw new Error("Failed to fetch data");
        const [optionsData, valuesData] = await Promise.all([
          optionsRes.json(),
          valuesRes.json(),
        ]);
        setOptions(optionsData);
        setOptionValues(valuesData);
      } catch (err) {
        toast.error("Error loading data");
        console.error("Fetch error:", err);
      }
    };
    fetchOptions();

    setSelectedOptions([
      { option: null, values: [{ value: null, price: 0, quantity: 1 }] },
    ]);
    setHasNoOptions(true);
    setHasNoOptionsInput({ price: 0.0, quantity: 1 });
  }, []);

  return (
    <div className="w-full">
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleConfirmAction}>Confirm</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button
            onClick={handleAddOption}
            className="bg-sky-500 hover:bg-sky-600"
            disabled={selectedOptions.length >= options.length}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Option
          </Button>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            onClick={() => {
              if (hasUnsavedChanges()) {
                setConfirmAction({
                  type: "hasNoOptions",
                  title:
                    "Switching will remove all options and values. Continue?",
                });
                setShowConfirm(true);
              } else {
                performHasNoOptions();
              }
            }}
          >
            <TbTrashX className="mr-2 h-5 w-5" /> Simple Product
          </Button>
        </div>
        <Button
          className="bg-rose-500 hover:bg-rose-600"
          onClick={() => {
            if (hasUnsavedChanges()) {
              setConfirmAction({
                type: "clear",
                title: "This will reset all inputs to default. Continue?",
              });
              setShowConfirm(true);
            } else {
              performClearAll();
            }
          }}
          disabled={!hasUnsavedChanges()}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>

      <div className="w-full grid grid-cols-2 gap-6">
        {!hasNoOptions ? (
          selectedOptions.map((sec, i) => (
            <div
              key={i}
              className="w-full flex flex-col justify-between gap-3 border rounded-lg p-4 bg-white shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Option {i + 1}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(i)}
                    disabled={selectedOptions.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="mb-4">
                  <Popover
                    open={openDropdowns.option === i}
                    onOpenChange={() => toggleOptionDropdown(i)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {sec.option?.name || "Select option"}
                        <ChevronsUpDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[562px] p-0">
                      <Command>
                        <CommandInput placeholder="Search option..." />
                        <CommandList>
                          <CommandEmpty>No option found</CommandEmpty>
                          <CommandGroup>
                            {options.map((o) => (
                              <CommandItem
                                key={o.id}
                                onSelect={() => {
                                  handleSelectOption(i, o.id);
                                  setOpenDropdowns((prev) => ({
                                    ...prev,
                                    option: null,
                                  }));
                                }}
                                disabled={selectedOptions.some(
                                  (opt, idx) =>
                                    idx !== i && opt.option?.id === o.id
                                )}
                              >
                                {o.name}
                                {sec.option?.id === o.id && (
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

                <div className="space-y-3">
                  {sec.values.map((r, vi) => (
                    <div key={vi} className="w-full flex gap-4 items-center">
                      <div className="w-[31%] flex flex-col items-start gap-1">
                        <div className="text-sm">Value</div>
                        <Popover
                          open={openDropdowns.value === `${i}-${vi}`}
                          onOpenChange={() => toggleValueDropdown(i, vi)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                              disabled={!sec.option}
                            >
                              {r.value?.value || "Select value"}
                              <ChevronsUpDown className="w-4 h-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-52 p-0"
                            key={`${i}-${vi}`}
                          >
                            <Command>
                              <CommandInput placeholder="Search value..." />
                              <CommandList>
                                <CommandEmpty>No values found</CommandEmpty>
                                <CommandGroup>
                                  {getValuesByOptionId(sec.option?.id).map(
                                    (vv) => (
                                      <CommandItem
                                        key={vv.id}
                                        onSelect={() => {
                                          handleSelectValue(i, vi, vv.id);
                                          setOpenDropdowns((prev) => ({
                                            ...prev,
                                            value: null,
                                          }));
                                        }}
                                        disabled={sec.values.some(
                                          (v) => v.value?.id === vv.id
                                        )}
                                      >
                                        {vv.value}
                                        {r.value?.id === vv.id && (
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
                      <div className="w-[31%] flex flex-col items-start gap-1">
                        <div className="text-sm">Price</div>
                        <input
                          type="number"
                          min={0}
                          step="1"
                          value={r.price}
                          onChange={(e) =>
                            setSelectedOptions((prev) =>
                              prev.map((opt, idx) =>
                                idx === i
                                  ? {
                                      ...opt,
                                      values: opt.values.map((v, j) =>
                                        j === vi
                                          ? {
                                              ...v,
                                              price: parseFloat(e.target.value),
                                            }
                                          : v
                                      ),
                                    }
                                  : opt
                              )
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                          placeholder="Price"
                        />
                      </div>
                      <div className="w-[31%] flex flex-col items-start gap-1">
                        <div className="text-sm">Quantity</div>
                        <input
                          type="number"
                          min={1}
                          step="1"
                          value={r.quantity}
                          onChange={(e) =>
                            setSelectedOptions((prev) =>
                              prev.map((opt, idx) =>
                                idx === i
                                  ? {
                                      ...opt,
                                      values: opt.values.map((v, j) =>
                                        j === vi
                                          ? {
                                              ...v,
                                              quantity: parseInt(
                                                e.target.value
                                              ),
                                            }
                                          : v
                                      ),
                                    }
                                  : opt
                              )
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                          placeholder="Quantity"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={sec.values.length <= 1}
                        onClick={() => handleRemoveValue(i, vi)}
                        className="w-[7%] self-end"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleAddValue(i)}
                disabled={
                  !sec.option ||
                  sec.values.some((v) => !v.value || v.price <= 0) ||
                  sec.values.length >=
                    getValuesByOptionId(sec.option?.id).length
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Value
              </Button>
            </div>
          ))
        ) : (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  value={productData.price}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setProductData((prev) => ({
                      ...prev,
                      price: value,
                    }));
                    setHasNoOptionsInput((prev) => ({
                      ...prev,
                      price: value,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  step="1"
                  min={1}
                  value={productData.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setProductData((prev) => ({
                      ...prev,
                      quantity: value,
                    }));
                    setHasNoOptionsInput((prev) => ({
                      ...prev,
                      quantity: value,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
