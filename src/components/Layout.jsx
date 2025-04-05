/* eslint-disable @next/next/no-img-element */
import { useUser } from "@/context/UserContext";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Log } from "oidc-client-ts";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function Layout({ children }) {
  const auth = useAuth();
  const router = useRouter();
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const { user, setUser } = useUser();

  const [activeItem, setActiveItem] = useState(null);

  // track logging out to trigger UI changes
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // https://authts.github.io/oidc-client-ts/index.html#md:logging
  if (process.env.NODE_ENV !== "development") {
    Log.setLevel(Log.NONE);
  } else {
    Log.setLogger(console);
  }

  const handleSignOut = () => {
    try {
      // Set logging out state to true immediately to trigger UI changes
      setIsLoggingOut(true);

      console.log("Starting sign-out process...");

      // Create the signout URL before clearing any data
      const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;
      const logoutUri = process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL;
      const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;

      // Ensure clientId is available
      if (!clientId) {
        console.error("Missing client ID for sign-out");
      }

      // Construct the sign-out URL explicitly with all required parameters
      const signOutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

      console.log("Sign-out URL:", signOutUrl);

      // Now clear application state
      setUser(null);

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // Notify other parts of the app
      window.dispatchEvent(new Event("storage"));

      // Add a slight delay before redirecting to ensure UI has time to update
      setTimeout(() => {
        window.location.href = signOutUrl;
      }, 300);
    } catch (error) {
      console.error("Error during sign-out:", error);
      // If there's an error, try a basic redirect
      window.location.href = "/";
    }
  };

  // See https://github.com/authts/react-oidc-context?tab=readme-ov-file#adding-event-listeners
  useEffect(() => {
    // the `return` is important - addAccessTokenExpiring() returns a cleanup function
    return auth.events.addAccessTokenExpiring(() => {
      if (
        alert(
          "You're about to be signed out due to inactivity. Press continue to stay signed in.",
        )
      ) {
        auth.signinSilent();
      }
    });
  }, [auth]);

  let navigation = useMemo(
    () => [
      { name: "Discover", href: "/", current: true },
      ...(auth?.isAuthenticated
        ? [{ name: "Create", href: "/create", current: false }]
        : []),
      {
        name: auth?.error
          ? "An error occurred. Please refresh the page."
          : auth?.isLoading
            ? "Loading..."
            : auth?.isAuthenticated
              ? "Profile"
              : "Log In / Sign Up",
        href: auth?.isAuthenticated
          ? "/profile"
          : process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL,
        current: false,
        onClick: auth?.isAuthenticated
          ? null
          : (e) => {
              e.preventDefault();
              auth.signinRedirect();
            },
      },
    ],
    [auth],
  );

  useEffect(() => {
    const handlePageLoad = () => {
      console.log("Page loaded");

      let currentActiveItem = navigation?.find((item) => item.current === true);

      let itemToSetAsActive = navigation?.find(
        (item) => item.href === window.location.pathname,
      );

      if (currentActiveItem) {
        currentActiveItem.current = false;
      }

      if (itemToSetAsActive) {
        itemToSetAsActive.current = true;
        console.log("set", itemToSetAsActive.current);
      }

      setActiveItem(navigation?.find((item) => item.current === true));
    };

    handlePageLoad();

    window.addEventListener("load", handlePageLoad);

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, [navigation]);

  //If user is authenticated assign the user info to be used, in not null
  const userInfo = auth?.isAuthenticated ? user : null;

  const userNavigation = auth?.isAuthenticated
    ? [
        {
          name: "Personal Collections",
          href: "/profile?tab=collections", //go to profile to personal collections
          onClick: (e) => {
            e.preventDefault();
            router.push("/profile?tab=collections"); // Programmatically navigate
          },
        },
        {
          name: "Sign out",
          href: "#",
          onClick: (e) => {
            e.preventDefault();
            handleSignOut();
          },
        },
      ]
    : [];

  return (
    <div className="min-h-full" style={{ backgroundColor: "black" }}>
      <Disclosure as="nav" className="bg-gray-800 z-10">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <NextLink href="/">
                      <img alt="TTG" src="/logo_256.png" className="size-16" />
                    </NextLink>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={item.onClick}
                          aria-current={item.current ? "page" : undefined}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium",
                          )}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  {auth?.isAuthenticated && (
                    <div className="ml-4 flex items-center md:ml-6">
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            {!isLoggingOut ? (
                              <img
                                alt="User profile"
                                src={userInfo?.profilePictureUrl}
                                className="size-8 rounded-full"
                                onError={(e) => {
                                  // If image fails to load, use a fallback
                                  e.target.src = "/placeholder/p01.png";
                                }}
                              />
                            ) : (
                              // Show a neutral loading indicator instead of potentially broken image
                              <div className="size-8 rounded-full bg-gray-600 flex items-center justify-center">
                                <span className="text-xs text-gray-300">
                                  ...
                                </span>
                              </div>
                            )}
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <MenuItem key={item.name}>
                              <a
                                href={item.href}
                                onClick={item.onClick}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {item.name}
                              </a>
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Menu>
                    </div>
                  )}
                </div>
                <div className="-mr-2 flex md:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon
                      aria-hidden="true"
                      className={classNames(
                        "size-6",
                        open ? "hidden" : "block",
                      )}
                    />
                    <XMarkIcon
                      aria-hidden="true"
                      className={classNames(
                        "size-6",
                        open ? "block" : "hidden",
                      )}
                    />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    onClick={item.onClick}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium",
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
              {auth?.isAuthenticated && (
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="shrink-0">
                      {!isLoggingOut ? (
                        <img
                          alt=""
                          src={userInfo?.profilePictureUrl}
                          className="size-10 rounded-full"
                          onError={(e) => {
                            e.target.src = "/placeholder/p01.png";
                          }}
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-xs text-gray-300">...</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      {/* Display the user's name or a fallback */}
                      <div className="text-base font-medium text-white">
                        {userInfo?.displayName ||
                          auth?.user?.profile["cognito:username"]}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={item.onClick}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </div>
                </div>
              )}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
