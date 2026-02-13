import React, { useMemo } from "react";
import StaggeredMenu from "./StaggeredMenu";
import { navItems, socialLinks } from "../constants/data";

const Navbar = () => {
  // Transform data for StaggeredMenu
  const menuItems = useMemo(
    () =>
      navItems.map((item) => ({
        label: item.name,
        link: item.path,
        ariaLabel: `Go to ${item.name}`,
      })),
    [],
  );

  const socialItems = useMemo(
    () =>
      socialLinks.map((item) => ({
        label: item.name,
        link: item.url,
      })),
    [],
  );

  return (
    <div style={{ position: "relative", zIndex: 9999 }}>
      <StaggeredMenu
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        logoUrl={null} // Triggers text fallback "HARISH"
        menuButtonColor="var(--text-primary)"
        openMenuButtonColor="var(--text-primary)"
        changeMenuColorOnOpen={false} // Keep it consistent
        colors={["#1e1e22", "#35353c"]}
        accentColor="#d4d4d8"
        position="right"
        isFixed={true} // Ensures overlay behavior
        onMenuOpen={() => console.log("Menu opened")}
        onMenuClose={() => console.log("Menu closed")}
      />
    </div>
  );
};

export default React.memo(Navbar);
