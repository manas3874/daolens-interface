import React, { useState, useContext, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HelpDrawerContext } from "../contexts/HelpDrawerContextProvider";
import styles from "../styles/componentStyles/helpDrawer.module.css";
import Image from "next/image";
function HelpDrawer() {
  // ! Context for the drawer
  const drawerContext = useContext(HelpDrawerContext);
  // ! Local states
  const [selectedTab, setSelectedTab] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    setExpanded("panel1");
  }, [selectedTab]);

  return (
    <React.Fragment key={"right"}>
      <SwipeableDrawer
        anchor={"right"}
        open={drawerContext.anchorPosition["right"]}
        onClose={drawerContext.toggleDrawer("right", false) as any}
        onOpen={drawerContext.toggleDrawer("right", true) as any}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <Image
              src="/icons_svg/back_icon.svg"
              alt="back_btn"
              height={12}
              width={12}
              style={{ cursor: "pointer" }}
              onClick={drawerContext.toggleDrawer("right", false) as any}
            />
            <Image
              src="/icons_svg/aave_mascot_small.svg"
              alt="back_btn"
              height={32}
              width={32}
              style={{ margin: "0 10px" }}
            />
            <span className={styles.headerText}>Aave help</span>
          </div>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="disabled tabs example"
            sx={{ justifyContent: "space-between !important" }}
          >
            <Tab
              label="General"
              id="help-section-single-tab"
              sx={{
                textDecoration: "none",
                color: "#fff",
                padding: "8px 16px !important",
              }}
            />
            <Tab
              label="Lend"
              id="help-section-single-tab"
              sx={{
                textDecorationStyle: "none",
                color: "#fff",
                padding: "8px 16px !important",
              }}
            />
            <Tab
              label="Borrow"
              id="help-section-single-tab"
              sx={{
                textDecoration: "none",
                color: "#fff",
                padding: "8px 16px !important",
              }}
            />
          </Tabs>

          {selectedTab === 0 && (
            <>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChangeAccordion("panel1")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    What is aave?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    Aave is a cryptocurrency borrowing and lending platform that
                    runs mostly on the Ethereum network. You can deposit your
                    tokens and earn interest or borrow coins and pay interest.
                    <br />
                    <br />
                    <a
                      href="https://www.youtube.com/watch?v=dTCwssZ116A"
                      style={{ color: "#8DA2FB" }}
                    >
                      What is AAVE - Explained
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChangeAccordion("panel2")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    What is a wallet? How to setup
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    A wallet is where you can securely keep your crypto safe.
                    Watch this to learn how to setup one.
                    <br />
                    <br />
                    <a
                      href="https://www.youtube.com/watch?v=byNNauAJrKI"
                      style={{ color: "#8DA2FB" }}
                    >
                      Watch how to set up a crypto wallet.
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChangeAccordion("panel3")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    How to buy crypto?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    Crypto can be purchased from various exchanges which are
                    available in the market.
                    <br />
                    <br />
                    <a
                      href="https://www.youtube.com/watch?v=0VC8tsYrKZM"
                      style={{ color: "#8DA2FB" }}
                    >
                      Watch this to know more!
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChangeAccordion("panel4")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel4a-content"
                  id="panel4a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    What is a token?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    A token can be associated with a currency in the WEB2 world.
                    There are many tokens in the market. Few popular ones are
                    Etherrum (ETH) and Bitcoin (BTC)
                    <br />
                    <br />
                    <a
                      href="https://www.coinbase.com/learn/crypto-basics/what-is-a-token"
                      style={{ color: "#8DA2FB" }}
                    >
                      Read this article to know more.
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </>
          )}
          {selectedTab === 1 && (
            <>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChangeAccordion("panel1")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel4a-content"
                  id="panel4a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    How to lend?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    Please click on the link to watch a video about lending
                    assets
                    <br />
                    <br />
                    <a
                      href="https://www.loom.com/share/e109b17aaa484ba3a92738dfc106ba36"
                      style={{ color: "#8DA2FB" }}
                    >
                      How to lend assets?
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </>
          )}
          {selectedTab === 2 && (
            <>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChangeAccordion("panel1")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    What is health factor?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    It is a number that represents the safety of an asset we
                    deposit as collateral against borrowed assets. The higher
                    the value is, the safer the state of your funds are against
                    a liquidation scenario. If the health factor reaches 1, the
                    liquidation of your deposits will be triggered.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChangeAccordion("panel2")}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: "1px solid #3F424F",
                  "&::before": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                  aria-controls="panel4a-content"
                  id="panel4a-header"
                  sx={{ padding: "0" }}
                >
                  <Typography sx={{ color: "#EAEBEF" }}>
                    How to borrow?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
                  <Typography sx={{ color: "#ffffff" }}>
                    Please click on the link to watch a video about borrowing
                    assets
                    <br />
                    <br />
                    <a
                      href="https://www.loom.com/share/9345ad77b3d44f1185e75147b1946e02"
                      style={{ color: "#8DA2FB" }}
                    >
                      How to borrow assets?
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

export default HelpDrawer;
