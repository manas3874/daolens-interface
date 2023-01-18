import Head from "next/head";
import React, { ReactNode, useState, createContext, useEffect } from "react";
import styles from "../styles/layoutStyles/dashboardLayout.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import HelpButton from "../components/buttons/HelpButton";
import ConnectWallet from "../components/buttons/ConnectWallet";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import HelpDrawer from "../components/HelpDrawer";
import { HelpDrawerContextProvider } from "../contexts/HelpDrawerContextProvider";
import { useRouter } from "next/router";
import Switch from "@mui/material/Switch";
import { getMarketInfoById, MarketLogo } from "src/components/MarketSwitcher";
import { Container, ListItemText, Menu } from "@mui/material";
import { CustomMarket } from "src/ui-config/marketsConfig";
import { availableMarkets } from "src/utils/marketsAndNetworksConfig";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
interface Props {
  children?: ReactNode;
}
enum SelectedMarketVersion {
  V2,
  V3,
}
function DashboardLayout({ children }: Props) {
  const router = useRouter();
  // ! Local states
  // const [selectedMarket, setSelectedMarket] = useState("");
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  const [selectedMarketVersion, setSelectedMarketVersion] =
    useState<SelectedMarketVersion>(SelectedMarketVersion.V3);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  useEffect(() => {
    const testnetsEnabledLocalstorage =
      window.localStorage.getItem(testnetsEnabledId) === "true" || false;
    setTestnetsMode(testnetsEnabledLocalstorage);
  }, []);

  const testnetsEnabledId = "testnetsEnabled";
  const [testnetsEnabled, setTestnetsMode] = useState(false);
  const toggleTestnetsEnabled = () => {
    const newState = !testnetsEnabled;
    setTestnetsMode(!testnetsEnabled);
    window.localStorage.setItem(testnetsEnabledId, newState ? "true" : "false");
    // Set window.location to trigger a page reload when navigating to the the dashboard
    window.location.reload();
  };
  const getMarketHelpData = (marketName: string) => {
    const testChains = [
      "Görli",
      "Ropsten",
      "Mumbai",
      "Fuji",
      "Testnet",
      "Kovan",
      "Rinkeby",
    ];
    const arrayName = marketName.split(" ");
    const testChainName = arrayName.filter((el) => testChains.indexOf(el) > -1);
    const marketTitle = arrayName
      .filter((el) => !testChainName.includes(el))
      .join(" ");
    return {
      name: marketTitle,
      testChainName: testChainName[0],
    };
  };
  return (
    <div className={styles.container}>
      <HelpDrawerContextProvider>
        <>
          <Head>
            <title>Daolens | Aave interface</title>
            <meta
              name="description"
              content="A revamped interface for the Aave lending product"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              color="transparent"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Toolbar className={styles.toolbar}>
                <div className={styles.toolbar_left}>
                  <Image
                    src="/icons_svg/aave_logo.svg"
                    alt="Aave"
                    width={100}
                    height={50}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/")}
                  />
                  <Typography
                    className={styles.toolbar_left__typography}
                    color="#ffffff"
                    variant="h4"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    onClick={() => router.push("/")}
                  >
                    Home
                  </Typography>
                  <Typography
                    className={styles.toolbar_left__typography}
                    color="#ffffff"
                    variant="h4"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </Typography>
                </div>
                <div className={styles.toolbar_right}>
                  
                  <HelpButton />
                  <FormControl
                    variant="standard"
                    sx={{
                      m: 1,
                      minWidth: 100,
                      transform: "translateY(-5px)",

                      marginTop: "14px !important",
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      sx={{
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Markets
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="market-dropdown-container"
                      value={currentMarket}
                      onChange={(e) =>
                        setCurrentMarket(
                          e.target.value as unknown as CustomMarket
                        )
                      }
                      label="Market"
                      sx={{
                        border: "none",
                        color: "#ffffff",
                        display: "flex",
                        marginRight: "10px",
                        "&::before": { border: "none" },
                        "&:hover": { border: "none" },
                        "> div": {
                          display: "flex",
                          "> div": { margin: "auto 5px" },
                        },
                      }}
                    >
                      {availableMarkets.map((marketId: CustomMarket) => {
                        const { market, network } = getMarketInfoById(marketId);
                        const marketNaming = getMarketHelpData(
                          market.marketTitle
                        );
                        return (
                          <MenuItem
                            key={marketId}
                            data-cy={`marketSelector_${marketId}`}
                            value={marketId}
                            sx={{
                              ".MuiListItemIcon-root": { minWidth: "unset" },
                              color: "#ffffff",
                              "&:hover": { backgroundColor: "#2D3347" },
                              display:
                                (market.v3 &&
                                  selectedMarketVersion ===
                                    SelectedMarketVersion.V2) ||
                                (!market.v3 &&
                                  selectedMarketVersion ===
                                    SelectedMarketVersion.V3)
                                  ? "none"
                                  : "flex",
                            }}
                          >
                            <MarketLogo
                              size={32}
                              logo={network.networkLogoPath}
                              testChainName={marketNaming.testChainName}
                            />
                            <ListItemText sx={{ mr: 0 }}>
                              {marketNaming.name} {market.isFork ? "Fork" : ""}
                            </ListItemText>
                            <ListItemText sx={{ textAlign: "right" }}>
                              <Typography
                                color="text.muted"
                                variant="description"
                              >
                                {marketNaming.testChainName}
                              </Typography>
                            </ListItemText>
                          </MenuItem>
                        );
                      })}
                      {/* <MenuItem value={"Polygon 1"}>
                        <Image
                          src="/icons_svg/polygon_icon.svg"
                          alt="Polygon"
                          width={16}
                          height={16}
                          style={{ marginRight: "8px" }}
                        />{" "}
                        Polygon 1
                      </MenuItem>
                      <MenuItem value={"Polygon 2"}>
                        <Image
                          src="/icons_svg/polygon_icon.svg"
                          alt="Polygon"
                          width={16}
                          height={16}
                          style={{ marginRight: "8px" }}
                        />{" "}
                        Polygon 2
                      </MenuItem>
                      <MenuItem value={"Polygon 3"}>
                        <Image
                          src="/icons_svg/polygon_icon.svg"
                          alt="Polygon"
                          width={16}
                          height={16}
                          style={{ marginRight: "8px" }}
                        />{" "}
                        Polygon 3
                      </MenuItem> */}
                    </Select>
                  </FormControl>
                  <ConnectWallet buttonText={"Connect Wallet"} />
                </div>
              </Toolbar>
            </AppBar>
            <AppBar
              position="static"
              color="transparent"
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <Toolbar className={styles.toolbar}>
                <div className={styles.toolbar_left}>
                  <Image
                    src="/icons_svg/aave_logo.svg"
                    alt="Aave"
                    width={100}
                    height={50}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/")}
                  />
                </div>
                <div className={styles.toolbar_right}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    <Typography
                      className={styles.toolbar_left__typography}
                      color="#ffffff"
                      variant="h4"
                      component="div"
                      sx={{ flexGrow: 1 }}
                      onClick={() => router.push("/")}
                    >
                      Home
                    </Typography>
                    <Typography
                      className={styles.toolbar_left__typography}
                      color="#ffffff"
                      variant="h4"
                      component="div"
                      sx={{ flexGrow: 1 }}
                      onClick={() => router.push("/dashboard")}
                    >
                      Dashboard
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: " 10px",
                      }}
                    >
                      <Typography
                        className={styles.toolbar_left__typography}
                        color="#ffffff"
                        variant="h4"
                        component="div"
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "0 !important",
                        }}
                        // onClick={() => router.push("/")}
                      >
                        <span>Testnet</span>
                        <Switch
                          checked={testnetsEnabled}
                          onChange={toggleTestnetsEnabled}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </Typography>
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#3F424F",
                        }}
                      ></div>
                      {/* <HelpButton /> */}
                      <FormControl
                        variant="standard"
                        sx={{
                          m: 1,
                          minWidth: 100,
                          // transform: "translateY(-5px)",
                          margin: "10px 0 20px 0",
                        }}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          sx={{
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Markets
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="market-dropdown-container"
                          value={currentMarket}
                          onChange={(e) =>
                            setCurrentMarket(
                              e.target.value as unknown as CustomMarket
                            )
                          }
                          label="Market"
                          sx={{
                            border: "none",
                            color: "#ffffff",
                            display: "flex",
                            marginRight: "10px",
                            "&::before": { border: "none" },
                            "&:hover": { border: "none" },
                            "> div": {
                              display: "flex",
                              "> div": { margin: "auto 5px" },
                            },
                          }}
                        >
                          {availableMarkets.map((marketId: CustomMarket) => {
                            const { market, network } =
                              getMarketInfoById(marketId);
                            const marketNaming = getMarketHelpData(
                              market.marketTitle
                            );
                            return (
                              <MenuItem
                                key={marketId}
                                data-cy={`marketSelector_${marketId}`}
                                value={marketId}
                                sx={{
                                  ".MuiListItemIcon-root": {
                                    minWidth: "unset",
                                  },
                                  color: "#ffffff",
                                  "&:hover": { backgroundColor: "#2D3347" },
                                  display:
                                    (market.v3 &&
                                      selectedMarketVersion ===
                                        SelectedMarketVersion.V2) ||
                                    (!market.v3 &&
                                      selectedMarketVersion ===
                                        SelectedMarketVersion.V3)
                                      ? "none"
                                      : "flex",
                                }}
                              >
                                <MarketLogo
                                  size={32}
                                  logo={network.networkLogoPath}
                                  testChainName={marketNaming.testChainName}
                                />
                                <ListItemText sx={{ mr: 0 }}>
                                  {marketNaming.name}{" "}
                                  {market.isFork ? "Fork" : ""}
                                </ListItemText>
                                <ListItemText sx={{ textAlign: "right" }}>
                                  <Typography
                                    color="text.muted"
                                    variant="description"
                                  >
                                    {marketNaming.testChainName}
                                  </Typography>
                                </ListItemText>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#3F424F",
                        }}
                      ></div>
                      <ConnectWallet buttonText={"Connect Wallet"} />
                    </div>
                  </Menu>
                </div>
              </Toolbar>
            </AppBar>
          </Box>

          <HelpDrawer />
          <main className={styles.main}>{children}</main>
        </>
      </HelpDrawerContextProvider>
    </div>
  );
}

export default DashboardLayout;
