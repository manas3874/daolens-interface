import React, { useEffect, useState } from "react";
import FlowLayout from "../../layouts/FlowLayout";
import styles from "../../styles/componentStyles/lendFlowCards/chooseLendingAsset.module.css";
import walletAssetData from "../../store/staticData/walletAssetDetails.json";
import borrowingAssetData from "../../store/staticData/borrowingAssetDetails.json";
import WalletAssetDetails from "../internalComponents/WalletAssetDetails";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import AssetAmountSelection from "../borrowFlowCards/AssetAmountSelection";
import { SelectChangeEvent } from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { emptyObject } from "src/helpers/types";
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "src/hooks/app-data-provider/useWalletBalances";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from "@aave/math-utils";
import InfoIcon from "@mui/icons-material/Info";
import BigNumber from "bignumber.js";
import { API_ETH_MOCK_ADDRESS, InterestRate } from "@aave/contract-helpers";
import { fetchIconSymbolAndName } from "src/ui-config/reservePatches";
import { shortenAPY, shortenNumber } from "src/helpers/shortenStrings";
import { Icon, Tooltip } from "@mui/material";
import { DetailsHFLine } from "src/components/transactions/FlowCommons/TxModalDetails";
import { getMaxAmountAvailableToBorrow } from "src/utils/getMaxAmountAvailableToBorrow";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { useRootStore } from "src/store/root";
import { useTransactionHandler } from "src/helpers/useTransactionHandler";
import { isEmpty } from "lodash";
import { TxAction } from "src/ui-config/errorMapping";
import { useModalContext } from "src/hooks/useModal";
import { useRouter } from "next/router";

export enum ErrorType {
  STABLE_RATE_NOT_ENABLED,
  NOT_ENOUGH_LIQUIDITY,
  BORROWING_NOT_AVAILABLE,
  NOT_ENOUGH_BORROWED,
}
function ChooseBorrowingAsset() {
  const router = useRouter();
  // ! Regex ******************************************************************************************
  // const decimalNumberRegex = /([0-9]|[1-9][0-9]|[1-9][0-9][0-9])/;
  // ! Contexts ******************************************************************************************
  const { reserves, marketReferencePriceInUsd, user, loading } =
    useAppDataContext();
  const { walletBalances } = useWalletBalances();
  const { currentNetworkConfig, currentChainId: marketChainId } =
    useProtocolDataContext();
  const {
    txError,
    retryWithApproval,
    mainTxState: borrowTxState,
    close: clearModalContext,
    // gasLimit,
  } = useModalContext();
  const {
    // bridge,
    // isTestnet,
    baseAssetSymbol,
    // name: networkName,
    // networkLogoPath,
  } = currentNetworkConfig;
  const {
    // connected,
    // currentAccount,
    // disconnectWallet,
    chainId: connectedChainId,
    // watchModeOnlyAddress,
    switchNetwork,
  } = useWeb3Context();
  const borrow = useRootStore((state) => state.borrow);
  // ! Local states ******************************************************************************************
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [currentAssetDetails, setcurrentAssetDetails] = useState(
    {} as emptyObject
  );
  const [availableReserves, setAvailableReserves] = useState([]);
  const [supplyReserves, setSupplyReserves] = useState([]);
  const [_amount, setAmount] = useState("");
  const [interestRateMode, setInterestRateMode] = useState<InterestRate>(
    InterestRate.Variable
  );
  const [borrowUnWrapped, setBorrowUnWrapped] = useState(true);
  // ! Variables ******************************************************************************************
  const borrowPositions =
    user?.userReservesData.reduce((acc, userReserve) => {
      if (userReserve.variableBorrows !== "0") {
        acc.push({
          ...userReserve,
          borrowRateMode: InterestRate.Variable,
          reserve: {
            ...userReserve.reserve,
            ...(userReserve.reserve.isWrappedBaseAsset
              ? fetchIconSymbolAndName({
                  symbol: currentNetworkConfig.baseAssetSymbol,
                  underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                })
              : {}),
          },
        });
      }
      if (userReserve.stableBorrows !== "0") {
        acc.push({
          ...userReserve,
          borrowRateMode: InterestRate.Stable,
          reserve: {
            ...userReserve.reserve,
            ...(userReserve.reserve.isWrappedBaseAsset
              ? fetchIconSymbolAndName({
                  symbol: currentNetworkConfig.baseAssetSymbol,
                  underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                })
              : {}),
          },
        });
      }
      return acc;
    }, [] as (ComputedUserReserveData & { borrowRateMode: InterestRate })[]) ||
    [];
  const poolReserve = reserves.find((reserve) => {
    if (
      currentAssetDetails.underlyingAsset?.toLowerCase() ===
      API_ETH_MOCK_ADDRESS.toLowerCase()
    )
      return reserve.isWrappedBaseAsset;
    return currentAssetDetails.underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;
  const maxAmountToBorrow = poolReserve
    ? getMaxAmountAvailableToBorrow(poolReserve, user, interestRateMode)
    : "0";
  const isMaxSelected = _amount === "-1";
  const amount = isMaxSelected ? maxAmountToBorrow.toString(10) : _amount;
  const amountToBorrowInUsd = poolReserve
    ? valueToBigNumber(amount)
        .multipliedBy(poolReserve.formattedPriceInMarketReferenceCurrency)
        .multipliedBy(marketReferencePriceInUsd)
        .shiftedBy(-USD_DECIMALS)
    : "";

  const newHealthFactor = calculateHealthFactorFromBalancesBigUnits({
    collateralBalanceMarketReferenceCurrency: user.totalCollateralUSD,
    borrowBalanceMarketReferenceCurrency: valueToBigNumber(
      user.totalBorrowsUSD
    ).plus(amountToBorrowInUsd),
    currentLiquidationThreshold: user.currentLiquidationThreshold,
  });
  const symbol =
    poolReserve?.isWrappedBaseAsset && true
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve?.symbol;
  const blockingError: ErrorType | undefined = undefined;
  const blocked = blockingError !== undefined;
  const poolAddress =
    borrowUnWrapped && poolReserve?.isWrappedBaseAsset
      ? API_ETH_MOCK_ADDRESS
      : poolReserve?.underlyingAsset;
  const requiredChainId = marketChainId;
  const isWrongNetwork = connectedChainId !== requiredChainId;

  const displayRiskCheckbox =
    newHealthFactor.toNumber() < 1.5 && newHealthFactor.toString() !== "-1";
  const {
    action,
    loadingTxns,
    mainTxState,
    approval,
    requiresApproval,
    approvalTxState,
  } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      return borrow({
        interestRateMode,
        amount: selectedAmount,
        reserve: poolAddress,
        debtTokenAddress:
          interestRateMode === InterestRate.Variable
            ? poolReserve.variableDebtTokenAddress
            : poolReserve.stableDebtTokenAddress,
      });
    },
    skip: !selectedAmount || selectedAmount === "0" || blocked,
    deps: [selectedAmount, interestRateMode],
  });
  // console.log("currentAssetDetails.underlyingAsset",currentAssetDetails.underlyingAsset)
  // ! Effects ******************************************************************************************
  useEffect(() => {
    // console.log("supplyTxState", supplyTxState);
    if (borrowTxState.success) {
      router.push({
        pathname: "/borrow/success",
        query: {
          underlyingAsset: currentAssetDetails.underlyingAsset,
          amount: selectedAmount,
        },
      });
      clearModalContext();
    }
  }, [borrowTxState]);
  useEffect(() => {
    setAmount(selectedAmount);
  }, [selectedAmount]);

  useEffect(() => {
    if (selectedAsset) {
      const found = availableReserves.find(
        (singleAsset: emptyObject) => singleAsset.id == selectedAsset
      );
      console.log("found asset", found);
      if (found) setcurrentAssetDetails(found);
      else setcurrentAssetDetails({});
      //   if (found) return found;
    }
  }, [selectedAsset]);
  useEffect(() => {
    const tokensToSupply = reserves
      .filter((reserve: ComputedReserveData) => !reserve.isFrozen)
      .map((reserve: ComputedReserveData) => {
        const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
        const walletBalanceUSD =
          walletBalances[reserve.underlyingAsset]?.amountUSD;
        let availableToDeposit = valueToBigNumber(walletBalance);
        if (reserve.supplyCap !== "0") {
          availableToDeposit = BigNumber.min(
            availableToDeposit,
            new BigNumber(reserve.supplyCap)
              .minus(reserve.totalLiquidity)
              .multipliedBy("0.995")
          );
        }
        const availableToDepositUSD = valueToBigNumber(availableToDeposit)
          .multipliedBy(reserve.priceInMarketReferenceCurrency)
          .multipliedBy(marketReferencePriceInUsd)
          .shiftedBy(-USD_DECIMALS)
          .toString();

        const isIsolated = reserve.isIsolated;
        const hasDifferentCollateral = user?.userReservesData.find(
          (userRes) =>
            userRes.usageAsCollateralEnabledOnUser &&
            userRes.reserve.id !== reserve.id
        );

        const usageAsCollateralEnabledOnUser = !user?.isInIsolationMode
          ? reserve.usageAsCollateralEnabled &&
            (!isIsolated || (isIsolated && !hasDifferentCollateral))
          : !isIsolated
          ? false
          : !hasDifferentCollateral;

        if (reserve.isWrappedBaseAsset) {
          let baseAvailableToDeposit = valueToBigNumber(
            walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount
          );
          if (reserve.supplyCap !== "0") {
            baseAvailableToDeposit = BigNumber.min(
              baseAvailableToDeposit,
              new BigNumber(reserve.supplyCap)
                .minus(reserve.totalLiquidity)
                .multipliedBy("0.995")
            );
          }
          const baseAvailableToDepositUSD = valueToBigNumber(
            baseAvailableToDeposit
          )
            .multipliedBy(reserve.priceInMarketReferenceCurrency)
            .multipliedBy(marketReferencePriceInUsd)
            .shiftedBy(-USD_DECIMALS)
            .toString();
          return [
            {
              ...reserve,
              reserve,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              ...fetchIconSymbolAndName({
                symbol: baseAssetSymbol,
                underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              }),
              walletBalance:
                walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount,
              walletBalanceUSD:
                walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD,
              availableToDeposit: baseAvailableToDeposit.toString(),
              availableToDepositUSD: baseAvailableToDepositUSD,
              usageAsCollateralEnabledOnUser,
              detailsAddress: reserve.underlyingAsset,
              id: reserve.id + "base",
            },
            {
              ...reserve,
              reserve,
              walletBalance,
              walletBalanceUSD,
              availableToDeposit:
                availableToDeposit.toNumber() <= 0
                  ? "0"
                  : availableToDeposit.toString(),
              availableToDepositUSD:
                Number(availableToDepositUSD) <= 0
                  ? "0"
                  : availableToDepositUSD.toString(),
              usageAsCollateralEnabledOnUser,
              detailsAddress: reserve.underlyingAsset,
            },
          ];
        }

        return {
          ...reserve,
          reserve,
          walletBalance,
          walletBalanceUSD,
          availableToDeposit:
            availableToDeposit.toNumber() <= 0
              ? "0"
              : availableToDeposit.toString(),
          availableToDepositUSD:
            Number(availableToDepositUSD) <= 0
              ? "0"
              : availableToDepositUSD.toString(),
          usageAsCollateralEnabledOnUser,
          detailsAddress: reserve.underlyingAsset,
        };
      })
      .flat();
    const sortedSupplyReserves = tokensToSupply.sort((a, b) =>
      +a.walletBalanceUSD > +b.walletBalanceUSD ? -1 : 1
    );
    const filteredSupplyReserves = sortedSupplyReserves.filter(
      (reserve) => reserve.availableToDepositUSD !== "0"
    );
    setAvailableReserves(sortedSupplyReserves as any);
    setSupplyReserves(filteredSupplyReserves as any);
  }, [reserves]);

  // ! Local handlers ******************************************************************************************
  const handleAssetChange = (event: SelectChangeEvent) => {
    setMaxBalance("");
    setSelectedAsset(event.target.value);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (borrowTxState?.loading) return;
    if (+event.target.value < 0) return;
    if (+event.target.value > +maxAmountToBorrow)
      return setSelectedAmount(maxAmountToBorrow.toString(10));
    return setSelectedAmount(event.target.value);
  };
  const setMaxBalance = (balance: string): any => {
    setSelectedAmount(balance);
  };
  const handleApproval = () => {
    approval(`${selectedAmount}`, poolAddress);
  };
  const hasApprovalError =
    requiresApproval &&
    txError &&
    txError.txAction === TxAction.APPROVAL &&
    txError.actionBlocked;
  const isAmountMissing = false;

  function getMainParams() {
    if (blocked)
      return { disabled: true, content: <span>Supply {symbol}</span> };
    if (
      txError &&
      txError.txAction === TxAction.GAS_ESTIMATION &&
      txError.actionBlocked
    )
      return {
        loading: false,
        disabled: true,
        content: <span>Supply {symbol}</span>,
      };
    if (
      txError &&
      txError.txAction === TxAction.MAIN_ACTION &&
      txError.actionBlocked
    )
      return {
        loading: false,
        disabled: true,
        content: <span>Supply {symbol}</span>,
      };
    if (isWrongNetwork)
      return { disabled: true, content: <span>Wrong Network</span> };
    if (isAmountMissing)
      return { disabled: true, content: <span>Enter an amount</span> };
    if (loadingTxns || isEmpty(mainTxState))
      return { disabled: true, loading: true };
    // if (hasApprovalError && handleRetry)
    //   return { content: <Trans>Retry with approval</Trans>, handleClick: handleRetry };
    if (mainTxState?.loading)
      return {
        loading: true,
        disabled: true,
        content: <span>Supplying {symbol}</span>,
      };
    if (requiresApproval && !approvalTxState?.success)
      return { disabled: true, content: <span>Supply {symbol}</span> };
    return { content: <span>Supply {symbol}</span>, handleClick: action };
  }

  function getApprovalParams() {
    if (
      !requiresApproval ||
      isWrongNetwork ||
      isAmountMissing ||
      loadingTxns ||
      hasApprovalError
    )
      return null;
    if (approvalTxState?.loading)
      return {
        loading: true,
        disabled: true,
        content: <span>Approving {symbol}...</span>,
      };
    if (approvalTxState?.success)
      return { disabled: true, content: <span>Approved</span> };
    if (retryWithApproval)
      return {
        content: <span>Retry with approval</span>,
        handleClick: handleApproval,
      };
    return {
      content: <span>Approve to continue</span>,
      handleClick: handleApproval,
    };
  }

  const {
    content,
    disabled,
    loading: mainLoading,
    handleClick,
  } = getMainParams();
  const approvalParams = getApprovalParams();
  const borrowAsset = () => {
    if (isWrongNetwork) return switchNetwork(requiredChainId);
    if (!selectedAmount) return alert("Add an amount greater than 0");
    if (+selectedAmount > +maxAmountToBorrow)
      return alert(
        `The max amount you can borrow is equivalent to $${maxAmountToBorrow}`
      );
    // const foundAsset: any = supplyReserves.find((singleAsset: emptyObject) => {
    //   return singleAsset.id == selectedAsset;
    // });
    // // console.log("foundAsset", foundAsset);
    // if (!foundAsset) return alert("Insufficient funds in your wallet");
    // if (+foundAsset.walletBalance < +selectedAmount)
    //   return alert("Insufficient funds in your wallet");
    return approvalParams && approvalParams.handleClick
      ? approvalParams.handleClick()
      : action();
  };
  const createTooltipText = () => {
    if (loadingTxns) return "Loading transactions from wallet";
    if (borrowTxState.loading) return "Processing your transaction";
    return "";
  };
  return (
    <div className={styles.container}>
      <FlowLayout
        sectionTitle={"Aave help"}
        title={
          selectedAsset ? (
            <>
              Enter the amount you want to borrow, don’t worry you can repay
              anytime 😊
            </>
          ) : (
            <>Let’s now choose the asset you want to borrow</>
          )
        }
        proceedButtonText={
          isWrongNetwork
            ? "Switch Network"
            : approvalParams && approvalParams.handleClick
            ? "Approve"
            : "Borrow"
        }
        clickHandle={borrowAsset}
        // isLoading={true}
        isLoading={loadingTxns || borrowTxState.loading}
        tooltipText={createTooltipText()}
      >
        <AssetAmountSelection
          selectedAmount={selectedAmount}
          selectedAsset={selectedAsset}
          updateAsset={handleAssetChange}
          updateAmount={handleAmountChange}
          availableReserves={availableReserves}
          poolReserve={poolReserve}
        />

        <Divider
          sx={{
            color: "#A5A8B6",
            margin: "20px 0",
            "&::after": { borderTop: "thin dotted #3F424F" },
            "&::before": { borderTop: "thin dotted #3F424F" },
          }}
        >
          {selectedAsset ? " " : "Borrowed Assets"}
        </Divider>

        {!loading && borrowPositions?.length > 0 && !selectedAsset && (
          <div className={styles.wallet_assets_container}>
            {borrowPositions.map((singleToken: emptyObject, index) => {
              return (
                <WalletAssetDetails
                  key={singleToken.underlyingAsset + singleToken.borrowRateMode}
                  tokenName={singleToken.reserve.name}
                  balanceTitle="Debt"
                  tokenBalance={Number(
                    singleToken.borrowRateMode === InterestRate.Variable
                      ? singleToken.variableBorrowsUSD
                      : singleToken.stableBorrowsUSD
                  )}
                  tokenInterestRate={shortenAPY(
                    // singleToken.borrowRateMode === InterestRate.Variable
                    //   ? singleToken.reserve.variableBorrowAPY
                    //   : singleToken.reserve.stableBorrowAPY
                    singleToken.reserve.stableBorrowAPY // ! Only stable for now
                  )}
                  tokenIcon={
                    <Image
                      src={`/icons/tokens/${singleToken.reserve.iconSymbol.toLowerCase()}.svg`}
                      width={28}
                      height={28}
                      alt={`${singleToken.reserve.iconSymbol}_icon`}
                    />
                  }
                  clickHandle={() => setSelectedAsset(singleToken.reserve.id)}
                />
              );
            })}
          </div>
        )}
        {selectedAsset ? (
          <div className={styles.selected_asset_details}>
            {/* <div className={styles.selected_asset_details__container}>
              <span>People invested</span>
              <span>
                <AvatarGroup
                  max={4}
                  sx={{ ">div": { width: 20, height: 20, fontSize: "10px" } }}
                >
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  <Avatar
                    alt="Travis Howard"
                    src="/static/images/avatar/2.jpg"
                  />
                  <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                  <Avatar
                    alt="Agnes Walker"
                    src="/static/images/avatar/4.jpg"
                  />
                  <Avatar
                    alt="Trevor Henderson"
                    src="/static/images/avatar/5.jpg"
                  />
                </AvatarGroup>
              </span>
            </div> */}
            <div className={styles.selected_asset_details__container}>
              <span>Annual interest rate</span>
              <span style={{ fontSize: "24px", color: "#31C48D" }}>
                {shortenAPY(
                  // currentAssetDetails.borrowRateMode === InterestRate.Variable
                  //   ? currentAssetDetails.variableBorrowAPY
                  //   : currentAssetDetails.stableBorrowAPY
                  currentAssetDetails.stableBorrowAPY // ! Only stable for now
                )}
              </span>
            </div>
            <div className={styles.selected_asset_details__container}>
              <span>Credit health factor</span>
              <span
                style={{
                  fontSize: "24px",
                  color: "#31C48D",
                  display: "inline-flex",
                  alignItems: "flex-start",
                  marginTop: "8px",
                }}
              >
                <DetailsHFLine
                  visibleHfChange={!!_amount}
                  healthFactor={user.healthFactor}
                  futureHealthFactor={newHealthFactor.toString(10)}
                />
                {+newHealthFactor.toString(10) < 1.5 && (
                  <Tooltip title="If you borrow this amount, you are at a risk of liquidation">
                    <InfoIcon
                      color="error"
                      fontSize="small"
                      sx={{ marginLeft: "10px" }}
                      id="small-amount-tooltip"
                    />
                  </Tooltip>
                )}
              </span>
            </div>
          </div>
        ) : null}
      </FlowLayout>
    </div>
  );
}

export default ChooseBorrowingAsset;
