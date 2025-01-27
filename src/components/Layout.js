import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function Layout({ children }) {
  const auth = useAuth();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false); //State to handle loading

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  //our protected routes
  const protectedRoutePrefixes = ["/create", "/profile"];

  useEffect(() => {
    if (!auth.isLoading) {
      //checking to see if any routes protected
      const isProtected = protectedRoutePrefixes.some((prefix) =>
        router.pathname.startsWith(prefix),
      );
      if (isProtected && !auth.isAuthenticated) {
        router.push(process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL);
      } else {
        setIsReady(true);
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, router.pathname]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  const handleSignOut = () => {
    const signOutUrl = () => {
      const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;
      const logoutUri = process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL;
      const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
      return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    // Remove user from the oidc context
    auth.removeUser();

    // Redirect to the Cognito sign-out URL
    window.location.href = signOutUrl();
  };

  const navigation = [
    { name: "Discover", href: "/", current: true },
    ...(auth?.isAuthenticated
      ? [{ name: "Create", href: "/create", current: false }]
      : []),
    {
      name: auth?.isAuthenticated ? "Profile" : "Log In / Sign Up",
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
  ];

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
                    <img alt="TTG" src="/logo_256.png" className="size-16" />
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
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon aria-hidden="true" className="size-6" />
                      </button>
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                              alt=""
                              src="/placeholder/p03.png"
                              className="size-8 rounded-full"
                            />
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
                      <img
                        alt=""
                        src="/placeholder/p03.png"
                        className="size-10 rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {auth?.user?.profile["cognito:username"]}
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
