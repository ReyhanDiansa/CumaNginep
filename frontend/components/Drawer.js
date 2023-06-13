import * as React from "react";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { FaBars,FaBed,FaCreditCard,FaUserAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/router";
import {MdMeetingRoom, MdHomeFilled} from "react-icons/md"
import {BsCalendarPlusFill} from "react-icons/bs"

const drawerWidth = 240;
import { useEffect, useState } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import styles from "../styles/Navbar.module.css";
import Image from "next/image"

function ResponsiveDrawer() {
  const [iconToggle, setIconToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mediaQueries = {
    small: "(max-width: 768px)",
    medium: "(min-width: 769px) and (max-width: 1024px)",
    large: "(min-width: 1025px)",
  };
  const router = useRouter();

  const isMedium = useMediaQuery(mediaQueries.medium);
  const isSmall = useMediaQuery(mediaQueries.small);

  useEffect(() => {
    if (isMedium || isSmall) {
      setIconToggle(true);
    } else {
      setIconToggle(false);
    }
  }, [isMedium, isSmall]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("nama_user")
    router.push("/login");
  };

  const link = [
    {
      name: "Beranda",
      link: "/admin",
      icon: <MdHomeFilled/>
    },
    {
      name: "User",
      link: "/admin/user",
      link1:"/admin/user/AddUser",
      link2:"/admin/user/UpdateUser/[id]",
      icon: <FaUserAlt/>
    },
    {
      name: "Room",
      link: "/admin/room",
      link1:"/admin/room/AddRoom",
      link2:"/admin/room/UpdateRoom/[id]",
      icon: <MdMeetingRoom/>

      
    },
    {
      name: "Room Type",
      link: "/admin/roomType",
      link1:"/admin/roomType/AddType",
      link2:"/admin/roomType/UpdateType/[id]",
      icon: <FaBed/>
    },
    {
      name: "Transaction",
      link: "/admin/transaction",
      icon: <FaCreditCard/>
    },
    {
      name: "Booking",
      link: "/admin/book",
      icon: <BsCalendarPlusFill/>
    },
  ];

  const firstPathname = router.pathname.replace("/admin", "");
  // console.log(firstPathname);
  const tryh = link[1].link.split("/")[1];
  // console.log("ppp", tryh);
  const color ="#024f79";

  const drawer = (
    <div>
      {/* <Typography
        variant="h6"
        component="h6"
        sx={{ margin: "1.5rem 1rem", color: color }}
      >
        CumaNginep
      </Typography> */}
      <Image 
      src="/logo_blue.png"
      width={120}
      height={80}
      alt="CumaNginep_logo"
      style={{objectFit:"contain", aspectRatio:"3/2", marginLeft:"1rem"}}
      />
      <Divider />
      <List>
        {link.map((item, index) => (
          <Link
            href={item.link}
            style={{ textDecoration: "none" }}
            key={index}
            className={styles.nav_link}
          >
            <ListItemButton
              className={
                router.pathname.starts === "/admin" && item.link === "/admin"
                  ? `${styles.side_active} ${styles.nav_link}`
                  : router.pathname === item.link || router.pathname === item.link1 || router.pathname === item.link2 
                  ? `${styles.side_active} ${styles.nav_link}`
                  : styles.nav_link
              }
            >
              <ListItemIcon sx={{ minWidth:"0", fontSize:"x-large", color:color}}>
                {item.icon}
                </ListItemIcon>
                <ListItemText
                  className={
                    router.pathname === `${item.link}` ? styles.nav_active : ""
                  }
                >
                  <Button
                    style={
                      router.pathname.starts === "/admin" &&
                      item.link === "/admin"
                        ? {
                            color: color,
                            fontWeight: "bold",
                            fontSize: "large",
                          }
                        : router.pathname === item.link || router.pathname === item.link1 || router.pathname === item.link2 
                        ? {
                            color: color,
                            fontWeight: "bold",
                            fontSize: "large",
                          }
                        : { color: color }
                    }
                  >
                    {item.name}
                  </Button>
                </ListItemText>
            </ListItemButton>
          </Link>
        ))}
        <Link
          href={router.pathname}
          onClick={handleLogOut}
          style={{ textDecoration: "none"}}
          className={styles.nav_link}
        >
          <ListItemButton className={styles.nav_link} sx={{marginTop:"2rem"}}>
            <ListItemIcon sx={{ minWidth:"0", fontSize:"xx-large", fontWeight:"bolder", color:color}}>
              <CiLogout/>
            </ListItemIcon>
              <ListItemText >
                <Button style={{ color: color }}>
                  Log Out
                  </Button>
              </ListItemText>
          </ListItemButton>
        </Link>
      </List>
    </div>
  );
  const sideBar = (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );

  const drawerResponsive = (
    <div>
      <Box sx={{ display: "flex", justifyContent:"space-between" }}>
      <Image 
      src="/logo_blue.png"
      width={120}
      height={80}
      alt="CumaNginep_logo"
      style={{objectFit:"contain", aspectRatio:"3/2", marginLeft:"1rem"}}
      />
        <AiOutlineClose className={styles.toggle} onClick={toggleMenu} />
      </Box>
      <Divider />
      <List>
        {link.map((item, index) => (
          <Link
            href={item.link}
            style={{ textDecoration: "none" }}
            key={index}
            className={styles.nav_link}
          >
            <ListItemButton
              className={
                router.pathname.starts === "/admin" && item.link === "/admin"
                  ? `${styles.side_active} ${styles.nav_link}`
                  : firstPathname === item.link.replace("/admin", "")
                  ? `${styles.side_active} ${styles.nav_link}`
                  : styles.nav_link
              }
            >
              <ListItemIcon sx={{ minWidth:"0", fontSize:"x-large", color:color}}>
                {item.icon}
                </ListItemIcon>
                <ListItemText
                  className={
                    router.pathname === `${item.link}` ? styles.nav_active : ""
                  }
                >
                  <Button
                    style={
                      router.pathname.starts === "/admin" &&
                      item.link === "/admin"
                        ? {
                            color: color,
                            fontWeight: "bold",
                            fontSize: "large",
                          }
                        : firstPathname === item.link.replace("/admin", "")
                        ? {
                            color: color,
                            fontWeight: "bold",
                            fontSize: "large",
                          }
                        : { color: color }
                    }
                  >
                    {item.name}
                  </Button>
                </ListItemText>
            </ListItemButton>
          </Link>
        ))}
        <Link
          href={router.pathname}
          onClick={handleLogOut}
          style={{ textDecoration: "none"}}
          className={styles.nav_link}
        >
          <ListItemButton className={styles.nav_link} sx={{marginTop:"2rem"}}>
            <ListItemIcon sx={{ minWidth:"0", fontSize:"xx-large", fontWeight:"bolder", color:color}}>
              <CiLogout/>
            </ListItemIcon>
              <ListItemText >
                <Button style={{ color: color }}>
                  Log Out
                  </Button>
              </ListItemText>
          </ListItemButton>
        </Link>
      </List>
    </div>
  );
  const sideBarResponsive = (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawerResponsive}
        </Drawer>
      </Box>
    </Box>
  );

  return (
    <>
      {iconToggle ? (
        <div className={styles.toggle}>
          <FaBars onClick={toggleMenu} />
        </div>
      ) : (
        sideBar
      )}

      {isOpen && sideBarResponsive}
    </>
  );
}

export default ResponsiveDrawer;
