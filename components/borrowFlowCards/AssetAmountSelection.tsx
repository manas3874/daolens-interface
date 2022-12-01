import React, { useState } from "react";
import styles from "../../styles/componentStyles/borrowFlowCards/assetAmountSelection.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import borrowingAssetData from "../../store/staticData/borrowingAssetDetails.json";
import { emptyObject } from "src/helpers/types";
import { shortenAPY } from "src/helpers/shortenStrings";
interface Props {
  selectedAsset?: string;
  selectedAmount: number;
  updateAsset?:
    | ((event: SelectChangeEvent<string>, child: React.ReactNode) => void)
    | undefined;
  updateAmount?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  availableReserves?: Array<object> ;
}
function AssetAmountSelection({
  selectedAmount,
  selectedAsset,
  updateAsset,
  updateAmount,
  availableReserves,
}: Props) {
  return (
    <div className={styles.container}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
        <InputLabel
          id="demo-simple-select-standard-label"
          sx={{ color: "#ffffff" }}
        >
          Choose asset to lend
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedAsset}
          onChange={updateAsset}
          label="Choose asset to lend"
          sx={{ color: "#ffffff" }}
        >
          {/* <div className={styles.table_container}> */}
          <div className={styles.table_container__head}>
            <span>Asset name</span>
            <span>Annual interest rate</span>
          </div>
          {availableReserves && availableReserves.length > 0 &&
            availableReserves?.map((singleRow: emptyObject, index: number) => {
              return (
                <MenuItem
                  key={`${singleRow.name} ${index}`}
                  value={singleRow.id}
                  className={styles.table_container__data}
                >
                  <span>{singleRow.name}</span>
                  <span>{shortenAPY(singleRow.supplyAPY)}</span>
                </MenuItem>
              );
            })}
          {/* </div> */}
        </Select>
      </FormControl>
      {selectedAsset && (
        <div className={styles.amount_input_container}>
          <input
            placeholder="Enter amount to lend"
            className={styles.amount_input_container__input}
            aria-label="amount-input"
            type="text"
            value={selectedAmount}
            onChange={updateAmount}
          />
          <span className={styles.amount_input_container__dollar}>
            ${selectedAmount * 0.5}
          </span>
        </div>
      )}
    </div>
  );
}

export default AssetAmountSelection;
