import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full h-20 border-t flex justify-center items-center font-medium">
      <p className="mr-1">Made with ❤️ by </p>{" "}
      <Link
        href={"https://github.com/yousef-yaghoubi"}
        className="text-primary font-bold"
        target="_blank"
      >
        {" "}
        yousef yaghoubi
      </Link>
    </footer>
  );
}

export default Footer;
