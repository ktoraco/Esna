"use client";

import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CustomIcon from "./CustomIcon";
import { usePathname } from "next/navigation";
import Image from "next/image";

type Game = {
  id: number;
  name: string;
  icon: string | { url: string }; // アイコンが文字列またはオブジェクトの場合に対応
};

type SidebarProps = {
  games: Game[];
  onGameClick: (gameId: number) => void;
};

const Sidebar: FC<SidebarProps> = ({ games, onGameClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 画面幅に応じたレスポンシブ調整
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (gameId: number) => {
    setSelectedGameId(gameId);
    onGameClick(gameId);
    router.push(`/game/${gameId}`);
  };

  // モバイル用とデスクトップ用のサイズ調整
  const sidebarWidth = isMobile ? "48px" : "56px";
  const iconSize = isMobile ? "w-8 h-8" : "w-12 h-12";
  const gameIconSize = isMobile ? "w-7" : "w-9";

  return (
    <motion.div className="flex h-screen relative" initial={{ width: isOpen ? "0px" : sidebarWidth }} animate={{ width: isOpen ? "0px" : sidebarWidth }} transition={{ duration: 0.3 }}>
      {/* サイドバーのトグルボタン - 位置を上部に調整 */}
      <button onClick={toggleSidebar} className={`absolute ${isMobile ? "bottom-24" : "bottom-28"} left-4 z-50 text-white rounded-md flex items-center justify-center ${iconSize}`}>
        <Image src={isOpen ? "/icons/sclose.svg" : "/icons/sopen.svg"} alt={isOpen ? "Close" : "Open"} width={48} height={48} className={`rounded-full ${iconSize}`} />
      </button>

      {/* サイドバーのコンテンツ */}
      <div className={`transition-width duration-300 h-full bg-stone-900 justify-center text-white ${isOpen ? "w-0" : isMobile ? "w-12" : "w-14"}`}>
        {/* ホームアイコン */}
        <motion.div className="flex flex-col justify-center items-center mt-2 rounded-full cursor-pointer" onClick={() => router.push("/")} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          <CustomIcon isGradient={pathname === "/"} size={isMobile ? 30 : 36} />
        </motion.div>

        {/* ゲームアイコンリスト */}
        <div className="flex flex-col items-center cursor-pointer gap-3 mt-2">
          {games.map((game) => {
            return (
              <motion.div key={game.id} onClick={() => handleClick(game.id)} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
                <Image src={typeof game.icon === "string" ? game.icon : game.icon?.url || "/icons/default-icon.png"} alt={game.name} width={48} height={48} className={`rounded-full ${gameIconSize} ${selectedGameId === game.id ? "opacity-100" : "opacity-80"}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
