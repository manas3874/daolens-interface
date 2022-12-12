import React, { useState } from "react";
import styles from "../../styles/componentStyles/borrowFlowCards/assetAmountSelection.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import BigNumber from "bignumber.js";
import borrowingAssetData from "../../store/staticData/borrowingAssetDetails.json";
import { emptyObject } from "src/helpers/types";
import { shortenAPY } from "src/helpers/shortenStrings";
import { USD_DECIMALS, valueToBigNumber } from "@aave/math-utils";
import { useAppDataContext } from "src/hooks/app-data-provider/useAppDataProvider";
interface Props {
  selectedAsset?: string;
  selectedAmount: string;
  updateAsset?:
    | ((event: SelectChangeEvent<string>, child: React.ReactNode) => void)
    | undefined;
  updateAmount?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  availableReserves?: Array<object>;
  poolReserve?: any;
}
function AssetAmountSelection({
  selectedAmount,
  selectedAsset,
  updateAsset,
  updateAmount,
  availableReserves,
  poolReserve,
}: Props) {
  // const { marketReferencePriceInUsd, user } = useAppDataContext();
  // const amountIntEth = new BigNumber(selectedAmount).multipliedBy(
  //   poolReserve?.formattedPriceInMarketReferenceCurrency
  // );
  const usdValue = poolReserve
    ? valueToBigNumber(selectedAmount).multipliedBy(poolReserve.priceInUSD)
    : "";

  return (
    <div className={styles.container}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
        <InputLabel
          id="demo-simple-select-standard-label"
          sx={{ color: "#ffffff" }}
        >
          Choose asset to borrow
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="lend_asset_selection_dropdown"
          value={selectedAsset}
          onChange={updateAsset}
          label="Choose asset to borrow"
          sx={{
            color: "#ffffff",
            "&::before": { border: "none" },
            "&:hover": { border: "none" },
          }}
        >
          {/* <div className={styles.table_container}> */}
          <div className={styles.table_container__head}>
            <span>Asset name</span>
            <span>Annual interest rate</span>
          </div>
          {availableReserves &&
            availableReserves.length > 0 &&
            availableReserves?.map((singleRow: emptyObject, index: number) => {
              return (
                <MenuItem
                  key={`${singleRow.name} ${index}`}
                  value={singleRow.id}
                  className={styles.table_container__data}
                >
                  <span>{singleRow.name}</span>
                  <span>
                    {shortenAPY(
                      singleRow.stableBorrowAPY // only stable borrowing as of now
                    )}
                  </span>
                </MenuItem>
              );
            })}
          {/* </div> */}
        </Select>
      </FormControl>
      {selectedAsset && (
        <div className={styles.amount_input_container}>
          <input
            placeholder="Enter amount to borrow"
            className={styles.amount_input_container__input}
            aria-label="amount-input"
            type="text"
            value={selectedAmount}
            onChange={updateAmount}
          />
          <span className={styles.amount_input_container__dollar}>
            {selectedAmount && <>${usdValue.toString(10)}</>}
          </span>
        </div>
      )}
    </div>
  );
}

export default AssetAmountSelection;
