"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";

const Navbar = () => {
  // State for menu visibility
  const [isOpen, setIsOpen] = useState(false);
  // State for tracking opened categories and subcategories
  const [openCategories, setOpenCategories] = useState(new Set());
  const [openSubCategories, setOpenSubCategories] = useState(new Set());

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

  //understand this
  // Navigation data
  const categories = [
    {
      name: "Bikes",
      href: "/bikes",
      subcategories: [
        {
          name: "Mountain Bikes",
          href: "/bikes/mountain",
          subSubcategories: [
            {
              name: "Full Suspension",
              href: "/bikes/mountain/full-suspension",
            },
            { name: "Hardtail", href: "/bikes/mountain/hardtail" },
            { name: "Electric", href: "/bikes/mountain/electric" },
          ],
        },
        {
          name: "Road Bikes",
          href: "/bikes/road",
          subSubcategories: [
            { name: "Racing", href: "/bikes/road/racing" },
            { name: "Gravel", href: "/bikes/road/gravel" },
            { name: "Touring", href: "/bikes/road/touring" },
          ],
        },
      ],
    },
    {
      name: "Components",
      href: "/components",
      subcategories: [
        {
          name: "Drivetrain",
          href: "/components/drivetrain",
          subSubcategories: [
            { name: "Chains", href: "/components/drivetrain/chains" },
            { name: "Cassettes", href: "/components/drivetrain/cassettes" },
            { name: "Derailleurs", href: "/components/drivetrain/derailleurs" },
          ],
        },
        {
          name: "Brakes",
          href: "/components/brakes",
          subSubcategories: [
            { name: "Disc Brakes", href: "/components/brakes/disc" },
            { name: "Brake Pads", href: "/components/brakes/pads" },
            { name: "Cables", href: "/components/brakes/cables" },
          ],
        },
      ],
    },
    {
      name: "Wheels & Tyres",
      href: "/components",
      subcategories: [
        {
          name: "Mountain Bikes",
          href: "/bikes/mountain",
        },
      ],
    },
    {
      name: "Seats",
      href: "/components",
    },
    {
      name: "Accessories",
      href: "/components",
    },
    {
      name: "Rider Essentials",
      href: "/components",
    },
    {
      name: "Maintenance",
      href: "/components",
    },
  ];

  // Toggle functions for categories and subcategories
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

  const toggleSubCategory = (subCategoryName, e) => {
    e.preventDefault();
    setOpenSubCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subCategoryName)) {
        newSet.delete(subCategoryName);
      } else {
        newSet.add(subCategoryName);
      }
      return newSet;
    });
  };

  // Close all menus
  const closeMenu = () => {
    setIsOpen(false);
    setOpenCategories(new Set());
    setOpenSubCategories(new Set());
  };

  return (
    <nav className="fixed top-0 z-50 w-full">
      {/* Main Navbar */}
      <div className="mx-4 my-2 font-bold text-black border rounded-lg shadow-lg backdrop-blur-md bg-white/30 border-white/10">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 text-xl font-bold">
              LOGO
            </Link>

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-8 custom:flex">
              {categories.map((category) => (
                <div key={category.name} className="relative group">
                  <Link
                    href={category.href}
                    className="hover:text-[#02D866] transition-colors py-2"
                  >
                    {category.name}
                  </Link>
                  {/* Desktop Dropdown */}
                  <div className="absolute left-0 invisible w-48 mt-2 transition-all opacity-0 group-hover:visible group-hover:opacity-100">
                    {category.subcategories?.length > 0 && (
                      <div className="py-2 rounded-lg shadow-lg backdrop-blur-md bg-primary">
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory.name}
                            className="relative group/sub"
                          >
                            <Link
                              href={subcategory.href}
                              className="block px-4 py-2 text-gray-200 hover:text-[#02D866] transition-colors"
                            >
                              {subcategory.name}
                            </Link>
                            {/* Desktop Sub-Dropdown */}
                            <div className="absolute top-0 invisible w-48 transition-all opacity-0 left-full group-hover/sub:visible group-hover/sub:opacity-100">
                              {subcategory.subSubcategories?.length > 0 && (
                                <div className="py-2 ml-2 rounded-lg shadow-lg bg-[#0A6E45] backdrop-blur-md">
                                  {subcategory.subSubcategories.map(
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
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/search"
                className="hover:text-[#02D866] transition-colors"
              >
                <Search className="w-6 h-6" />
              </Link>
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
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full animate-pulse -top-2 -right-2">
                  {/* Add here cart items  */}0
                </span>
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
                    {category.subcategories?.length > 0 && (
                      <button
                        onClick={(e) => toggleCategory(category.name, e)}
                        className="ml-2 p-2 text-gray-300 hover:text-[#02D866] transition-colors"
                      >
                        {openCategories.has(category.name) ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {openCategories.has(category.name) &&
                    category.subcategories?.length > 0 && (
                      <div className="pl-4 	bg-[#0A6E45]">
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory.name}
                            className="border-t border-primary-foreground "
                          >
                            <div className="flex items-center justify-between px-4 py-2">
                              <Link
                                href={subcategory.href}
                                className="flex-grow text-gray-200 hover:text-[#02D866] transition-colors"
                                onClick={closeMenu}
                              >
                                {subcategory.name}
                              </Link>
                              {subcategory.subSubcategories?.length > 0 && (
                                <button
                                  onClick={(e) =>
                                    toggleSubCategory(subcategory.name, e)
                                  }
                                  className="ml-2 p-2 text-gray-300 hover:text-[#02D866] transition-colors"
                                >
                                  {openSubCategories.has(subcategory.name)
                                    ? "−"
                                    : "+"}
                                </button>
                              )}
                            </div>

                            {openSubCategories.has(subcategory.name) &&
                              subcategory.subSubcategories?.length > 0 && (
                                <div className="pl-4 text-[#100c0c] bg-[#02D866]">
                                  {subcategory.subSubcategories.map(
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
