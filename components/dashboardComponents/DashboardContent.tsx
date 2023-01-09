
import { Skeleton } from "@mui/material";
import React, { Fragment, useState } from "react";
import {
  ComputedUserReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import { fetchIconSymbolAndName } from "src/ui-config/reservePatches";
import styles from "../../styles/componentStyles/dashboardComponents/DashboardContent.module.css";
import BorrowedAssets from "./BorrowedAssets";
import DashboardDetails from "./DashboardDetails";
import SuppliedAssets from "./SuppliedAssets";
interface Props {
  children?: React.ReactNode;
}
function DashboardContent({ children }: Props) {
  const { user, loading } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const [currentFlow, setCurrentFlow] = useState("lend");
  // ! Variables *****************************************************************************


  // console.log("suppliedPosition", borrowPositions);
  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <DashboardDetails />
      <div className={styles.flow_selector_container}>
        <div
          className={
            currentFlow === "lend" ? styles.selected : styles.not_selected
          }
          onClick={() => {
            setCurrentFlow("lend");
          }}
        >
          <span>Lend</span>
        </div>
        <div
          className={
            currentFlow === "borrow" ? styles.selected : styles.not_selected
          }
          onClick={() => {
            setCurrentFlow("borrow");
          }}
        >
          <span>Borrow</span>
        </div>
      </div>

      {loading ? (
        <>
          <Skeleton height={44} width="100%" /><br/>
          <Skeleton height={44} width="100%" /><br/>
          <Skeleton height={44} width="100%" /><br/>
          <Skeleton height={44} width="100%" /><br/>
        </>
      ) : (
        <div className={styles.table_container}>
          <div className={styles.table_header}>
            <span>Asset</span>
            <span>{currentFlow === "lend" ? "Lent amount" : "Debt"}</span>
            <span>Annual Interest</span>
            <span></span>
          </div>
          {currentFlow === "lend" &&
            <SuppliedAssets/>}
          {currentFlow === "borrow" &&
            <BorrowedAssets/>}
        </div>
      )}

      {children}
    </div>
  );
}

export default DashboardContent;
