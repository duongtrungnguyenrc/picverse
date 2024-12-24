import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type FooterProps = {};

const Footer: FC<FooterProps> = ({}) => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-8 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="" className="flex items-center">
              <Image
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 me-3"
                width={30}
                height={30}
                alt="FlowBite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Picverse</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="https://flowbite.com/" className="hover:underline text-sm">
                    Flowbite
                  </Link>
                </li>
                <li>
                  <Link href="https://tailwindcss.com/" className="hover:underline text-sm">
                    Tailwind CSS
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="https://github.com/themesberg/flowbite" className="hover:underline text-sm">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="https://discord.gg/4eeurUVvTy" className="hover:underline text-sm">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="#" className="hover:underline text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-sm">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024
            <Link href="/" className="hover:underline ms-2">
              Picverse™
            </Link>
            . All Rights Reserved.
          </span>
          <div className="flex items-center mt-4 sm:justify-center sm:mt-0">
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <Image width={16} height={16} src="/icons/facebook.svg" alt="facebook icon" />
              <span className="sr-only">Facebook page</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
              <Image width={16} height={16} src="/icons/discord.svg" alt="discord icon" />

              <span className="sr-only">Discord community</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
              <Image width={16} height={16} src="/icons/twitter.svg" alt="twitter icon" />

              <span className="sr-only">Twitter page</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
              <Image width={16} height={16} src="/icons/github.svg" alt="github icon" />

              <span className="sr-only">GitHub account</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
