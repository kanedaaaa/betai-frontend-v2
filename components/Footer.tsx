import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07070A] text-white py-8 px-5 w-full flex justify-center items-center border-t border-[#212429] shadow-lg">
      <div className="max-w-[1200px] w-full flex justify-between items-center">
        <span className="text-lg opacity-80">Made with ❤️</span>
        <span className="text-lg opacity-80 font-bold">BETAI</span>
      </div>
    </footer>
  );
};

export default Footer;
