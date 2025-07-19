"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import SearchModal from "./SearchModal";

const Navbar = () => {
  // State for menu visibility
  const [isOpen, setIsOpen] = useState(false);
  // State for tracking opened categories and subCategories
  const [openCategories, setOpenCategories] = useState(new Set());
  const [opensubCategories, setOpensubCategories] = useState(new Set());
  const { getTotalItems } = useCartStore();

  const totalItems = getTotalItems();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Navigation data
  const categories = [
    {
      name: "Bike",
      href: "/category/bike",
    },
    {
      name: "Gears & Chains",
      href: "/category/gears-and-chains",
      subCategories: [
        {
          name: "Drivetrain Components",
          href: "/category/gears-and-chains/drivetrain-components",
          subSubCategories: [
            {
              name: "Chains",
              href: "/category/gears-and-chains/drivetrain-components/chains",
            },
            {
              name: "Chainwheel & Cranks",
              href: "/category/gears-and-chains/drivetrain-components/chainwheel-and-cranks",
            },
            {
              name: "Derailleurs",
              href: "/category/gears-and-chains/drivetrain-components/derailleurs",
            },
            {
              name: "Derailleur Dropouts",
              href: "/category/gears-and-chains/drivetrain-components/derailleur-dropouts",
            },
            {
              name: "Freewheels",
              href: "/category/gears-and-chains/drivetrain-components/freewheels",
            },
            {
              name: "Groupset",
              href: "/category/gears-and-chains/drivetrain-components/groupset",
            },
          ],
        },
        {
          name: "Shifters",
          href: "/category/gears-and-chains/shifters",
        },
        {
          name: "Pedals & Cleats",
          href: "/category/gears-and-chains/pedals-and-cleats",
        },
        { name: "B.B. Sets", href: "/category/gears-and-chains/b.b.-sets" },
      ],
    },
    {
      name: "Wheels & Suspension",
      href: "/category/wheels-and-suspension",
      subCategories: [
        {
          name: "Wheels & Hubs",
          href: "/category/wheels-and-suspension/wheels-and-hubs",
          subSubCategories: [
            {
              name: "Alloy Hubs",
              href: "/category/wheels-and-suspension/wheels-and-hubs/alloy-hubs",
            },
            {
              name: "Rims",
              href: "/category/wheels-and-suspension/wheels-and-hubs/rims",
            },
            {
              name: "Spokes",
              href: "/category/wheels-and-suspension/wheels-and-hubs/spokes",
            },
            {
              name: "Quick Release",
              href: "/category/wheels-and-suspension/wheels-and-hubs/quick-release",
            },
            {
              name: "Hubs",
              href: "/category/wheels-and-suspension/wheels-and-hubs/hubs",
            },
          ],
        },
        {
          name: "Suspension Systems",
          href: "/category/wheels-and-suspension/suspension-systems",
          subSubCategories: [
            {
              name: "Suspension Forks",
              href: "/category/wheels-and-suspension/suspension-systems/suspension-forks",
            },
          ],
        },
        {
          name: "Tyres & Tubes",
          href: "/category/wheels-and-suspension/tyres-and-tubes",
          subSubCategories: [
            {
              name: "Tyre",
              href: "/category/wheels-and-suspension/tyres-and-tubes/tyre",
            },
            {
              name: "Tubes",
              href: "/category/wheels-and-suspension/tyres-and-tubes/tubes",
            },
          ],
        },
        {
          name: "Carbon Wheels & Accessories",
          href: "/category/wheels-and-suspension/carbon-wheels-and-accessories",
          subSubCategories: [
            {
              name: "Carbon Wheels",
              href: "/category/wheels-and-suspension/carbon-wheels-and-accessories/carbon-wheels",
            },
            {
              name: "Rim Tapes",
              href: "/category/wheels-and-suspension/carbon-wheels-and-accessories/rim-tapes",
            },
          ],
        },
      ],
    },
    {
      name: "Brakes",
      href: "/category/brakes-and-safety",
      subCategories: [
        {
          name: "Braking Systems",
          href: "/category/brakes-and-safety/braking-systems",
          subSubCategories: [
            {
              name: "Brake Set",
              href: "/category/brakes-and-safety/braking-systems/brake-set",
            },
            {
              name: "Hydraulic Brake Set",
              href: "/category/brakes-and-safety/braking-systems/hydraulic-brake-set",
            },
            {
              name: "Wires & Cables",
              href: "/category/brakes-and-safety/braking-systems/wires-and-cables",
            },
            {
              name: "Brake Levers",
              href: "/category/brakes-and-safety/braking-systems/brake-levers",
            },
          ],
        },
      ],
    },
    {
      name: "Frames",
      href: "/category/frames-and-components",
      subCategories: [
        {
          name: "Frame Attachments",
          href: "/category/frames-and-components/frame-attachments",
          subSubCategories: [
            {
              name: "Chain Guard",
              href: "/category/frames-and-components/frame-attachments/chain-guard",
            },
            {
              name: "Kick Stands",
              href: "/category/frames-and-components/frame-attachments/kick-stands",
            },
            {
              name: "Seat Post & Clamps",
              href: "/category/frames-and-components/frame-attachments/seat-post-and-clamps",
            },
          ],
        },
        {
          name: "Steering Components",
          href: "/category/frames-and-components/steering-components",
          subSubCategories: [
            {
              name: "Handle Bar",
              href: "/category/frames-and-components/steering-components/handle-bar",
            },
            {
              name: "Handle Grips",
              href: "/category/frames-and-components/steering-components/handle-grips",
            },
            {
              name: "Handle Stem",
              href: "/category/frames-and-components/steering-components/handle-stem",
            },
          ],
        },
        {
          name: "Headsets",
          href: "/category/frames-and-components/headsets",
        },
        { name: "Saddles", href: "/category/frames-and-components/saddles" },
      ],
    },
    {
      name: "Accessories",
      href: "/category/accessories-and-essentials",
      subCategories: [
        {
          name: "Riding Accessories",
          href: "/category/accessories-and-essentials/riding-accessories",
          subSubCategories: [
            {
              name: "Handle Bar Tapes",
              href: "/category/accessories-and-essentials/riding-accessories/handle-bar-tapes",
            },
            {
              name: "Clothing & Accessories",
              href: "/category/accessories-and-essentials/riding-accessories/clothing-and-accessories",
            },
            {
              name: "Cycling Shoes",
              href: "/category/accessories-and-essentials/riding-accessories/cycling-shoes",
            },
            {
              name: "Helmets",
              href: "/category/accessories-and-essentials/riding-accessories/helmets",
            },
            {
              name: "Lights",
              href: "/category/accessories-and-essentials/riding-accessories/lights",
            },
            {
              name: "Mirrors",
              href: "/category/accessories-and-essentials/riding-accessories/mirrors",
            },
            {
              name: "Locks",
              href: "/category/accessories-and-essentials/riding-accessories/locks",
            },
          ],
        },
        {
          name: "Cycling Essentials",
          href: "/category/accessories-and-essentials/cycling-essentials",
          subSubCategories: [
            {
              name: "Air Pumps",
              href: "/category/accessories-and-essentials/cycling-essentials/air-pumps",
            },
            {
              name: "Bottles & Cages",
              href: "/category/accessories-and-essentials/cycling-essentials/bottles-and-cages",
            },
            {
              name: "Mudguards",
              href: "/category/accessories-and-essentials/cycling-essentials/mudguards",
            },
          ],
        },
        {
          name: "Storage & Travel",
          href: "/category/accessories-and-essentials/storage-and-travel",
          subSubCategories: [
            {
              name: "Bags & Travel Cases",
              href: "/category/accessories-and-essentials/storage-and-travel/bags-and-travel-cases",
            },
            {
              name: "Carriers",
              href: "/category/accessories-and-essentials/storage-and-travel/carriers",
            },
            {
              name: "Baby Seats",
              href: "/category/accessories-and-essentials/storage-and-travel/baby-seats",
            },
          ],
        },

        {
          name: "Tools & Maintenance",
          href: "/category/accessories-and-essentials/tools-and-maintenance",
          subSubCategories: [
            {
              name: "Bike Tools",
              href: "/category/accessories-and-essentials/tools-and-maintenance/bike-tools",
            },
            {
              name: "Maintenance",
              href: "/category/accessories-and-essentials/tools-and-maintenance/maintenance",
            },
          ],
        },
      ],
    },
    {
      name: "Add-ons",
      href: "/category/add-ons",
      subCategories: [
        {
          name: "Performance Equipment",
          href: "/category/add-ons/performance-equipment",
          subSubCategories: [
            {
              name: "Indoor Trainers",
              href: "/category/add-ons/performance-equipment/indoor-trainers",
            },
            {
              name: "Speedometers",
              href: "/category/add-ons/performance-equipment/speedometers",
            },
          ],
        },
        {
          name: "Miscellaneous",
          href: "/category/add-ons/miscellaneous",
          subSubCategories: [
            {
              name: "Display Stands",
              href: "/category/add-ons/miscellaneous/display-stands",
            },
            {
              name: "Mobile Consoles",
              href: "/category/add-ons/miscellaneous/mobile-consoles",
            },
          ],
        },
      ],
    },
  ];

  // Toggle functions for categories and subCategories
  const toggleCategory = (categoryName, e) => {
    e.preventDefault();
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const togglesubCategories = (subCategoriesName, e) => {
    e.preventDefault();
    setOpensubCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subCategoriesName)) {
        newSet.delete(subCategoriesName);
      } else {
        newSet.add(subCategoriesName);
      }
      return newSet;
    });
  };

  // Close all menus
  const closeMenu = () => {
    setIsOpen(false);
    setOpenCategories(new Set());
    setOpensubCategories(new Set());
  };

  return (
    <nav className="fixed top-0 z-50 w-full ">
      {/* Main Navbar */}
      <div className="mx-4 my-2 font-bold text-black border rounded-lg shadow-lg backdrop-blur-md bg-white/30 ">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0 text-xl font-bold">
              <picture>
                <source
                  media="(max-width: 430px)"
                  width="50"
                  srcSet="/icon-light.png"
                />
                <Image src="/logo.png" alt="Logo" width={200} height={100} />
              </picture>
            </Link>

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-8 custom:flex">
              {categories.map((category, index) => {
                // Check if this is one of the last few items that might overflow
                const isRightAligned = index >= categories.length - 1;

                return (
                  <div key={category.name} className="relative group">
                    <Link
                      href={category.href}
                      className="hover:text-[#02D866] text-m drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,1)] transition-colors py-2"
                    >
                      {category.name}
                    </Link>
                    {/* Desktop Dropdown */}
                    <div
                      className={`absolute mt-2 w-48 transition-all opacity-0 invisible group-hover:visible group-hover:opacity-100 ${
                        isRightAligned ? "right-0" : "left-0"
                      }`}
                    >
                      {category.subCategories?.length > 0 && (
                        <div className="py-2 rounded-lg shadow-lg backdrop-blur-md bg-primary">
                          {category.subCategories.map((subCategories) => (
                            <div
                              key={subCategories.name}
                              className="relative group/sub"
                            >
                              <Link
                                href={subCategories.href}
                                className="block px-4 py-2 text-gray-200 hover:text-[#02D866] transition-colors"
                              >
                                {subCategories.name}
                              </Link>
                              {/* Desktop Sub-Dropdown */}
                              <div
                                className={`absolute top-0 w-48 transition-all opacity-0 invisible group-hover/sub:visible group-hover/sub:opacity-100 ${
                                  isRightAligned
                                    ? "right-full mr-2"
                                    : "left-full ml-2"
                                }`}
                              >
                                {subCategories.subSubCategories?.length > 0 && (
                                  <div className="py-2 rounded-lg shadow-lg backdrop-blur-md bg-[#0A6E45]">
                                    {subCategories.subSubCategories.map(
                                      (subSub) => (
                                        <Link
                                          key={subSub.name}
                                          href={subSub.href}
                                          className="block px-4 py-2 text-gray-200 hover:text-[#02D866] transition-colors"
                                        >
                                          {subSub.name}
                                        </Link>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <SearchModal />
              <Link
                href="/account"
                className="hover:text-[#02D866] transition-colors"
              >
                <User className="w-6 h-6" />
              </Link>
              <Link
                href="/cart"
                className="relative hover:text-[#02D866] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems ? (
                  <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full animate-pulse -top-2 -right-2">
                    {totalItems}
                  </span>
                ) : null}
              </Link>
              {/* Mobile menu button */}
              <button
                className="custom:hidden hover:text-[#02D866] transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-6 h-6 " />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-50 bg-black/50" onClick={closeMenu} />
          {/* Sliding Menu Panel */}
          <div
            className={`fixed top-0  right-0  h-full bg-primary z-50 transform  transition-transform  w-3/4 md:w-1/2   ${
              isOpen ? "animate-slideInRight" : "animate-slideInLeft"
            } overflow-y-auto  `}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary-foreground">
              <span className="text-lg font-semibold text-white">
                Categories
              </span>
              <button
                onClick={closeMenu}
                className="text-gray-300 hover:text-[#02D866] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="border-b border-primary-foreground"
                >
                  <div className="flex items-center justify-between px-4 py-2">
                    <Link
                      href={category.href}
                      className="flex-grow text-gray-100 hover:text-[#02D866] transition-colors"
                      onClick={closeMenu}
                    >
                      {category.name}
                    </Link>
                    {category.subCategories?.length > 0 && (
                      <button
                        onClick={(e) => toggleCategory(category.name, e)}
                        className="ml-2 p-2 text-gray-300 hover:text-[#02D866] transition-colors"
                      >
                        {openCategories.has(category.name) ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {openCategories.has(category.name) &&
                    category.subCategories?.length > 0 && (
                      <div className="pl-4 	bg-[#0A6E45]">
                        {category.subCategories.map((subCategories) => (
                          <div
                            key={subCategories.name}
                            className="border-t border-primary-foreground "
                          >
                            <div className="flex items-center justify-between px-4 py-2">
                              <Link
                                href={subCategories.href}
                                className="flex-grow text-gray-200 hover:text-[#02D866] transition-colors"
                                onClick={closeMenu}
                              >
                                {subCategories.name}
                              </Link>
                              {subCategories.subSubCategories?.length > 0 && (
                                <button
                                  onClick={(e) =>
                                    togglesubCategories(subCategories.name, e)
                                  }
                                  className="ml-2 p-2 text-gray-300 hover:text-[#02D866] transition-colors"
                                >
                                  {opensubCategories.has(subCategories.name)
                                    ? "−"
                                    : "+"}
                                </button>
                              )}
                            </div>

                            {opensubCategories.has(subCategories.name) &&
                              subCategories.subSubCategories?.length > 0 && (
                                <div className="pl-4 text-[#100c0c] bg-[#02D866]">
                                  {subCategories.subSubCategories.map(
                                    (subSub) => (
                                      <Link
                                        key={subSub.name}
                                        href={subSub.href}
                                        className="block px-4 py-2 border-t border-[#100c0c] text-[#100c0c] hover:text-[#02D866] transition-colors"
                                        onClick={closeMenu}
                                      >
                                        {subSub.name}
                                      </Link>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {/* Mobile Menu Footer */}
              <div className="px-4 mt-4 space-y-2">
                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-gray-200 hover:text-[#02D866] transition-colors py-2"
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5" />
                  <span>My Account</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
