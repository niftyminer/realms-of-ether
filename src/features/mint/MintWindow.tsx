import { ethers } from "ethers";
import { FC, useState } from "react";
import { TransactionErrorMessage } from "../../components/TransactionErrorMessage";
import { WaitingForTransactionMessage } from "../../components/WaitingForTransactionMessage";
import { useInterval } from "../../utils/useInterval";
import { useContractCall } from "../useTransaction";

const overrides = {
  // To convert Ether to Wei:
  //   value: ethers.utils.parseEther(this.state.nextTilePrice.toString())     // ether in this case MUST be a string
  value: ethers.utils.parseEther("0.1"),
  // Or you can use Wei directly if you have that:
  // value: someBigNumber
  // value: 1234   // Note that using JavaScript numbers requires they are less than Number.MAX_SAFE_INTEGER
  // value: "1234567890"
  // value: "0x1234"

  // Or, promises are also supported:
  // value: provider.getBalance(addr)
};

export const MintWindow: FC<{
  contract: ethers.Contract | undefined;
  show: boolean;
  setShow: (value: boolean) => void;
}> = (props) => {
  const [fortressName, setFortressName] = useState("");
  const { contractCall, transactionError, setTransactionError, txBeingSent } =
    useContractCall(
      async () => await props.contract?.createFortress(fortressName, overrides)
    );

  const [progress, setProgress] = useState<null | number>(null);

  useInterval(
    () => {
      if (progress !== 99) {
        setProgress(progress != null ? progress + 1 : 1);
      }
    },
    txBeingSent ? 500 : null
  );

  return (
    <></>
    // <Window
    //   IconComponent={Wab321018}
    //   title="Mint"
    //   show={props.show}
    //   setShow={props.setShow}
    //   approveLabel="Mint"
    //   onApprove={async () => {
    //     await contractCall();
    //   }}
    // >
    //   <h1>Mint Fortress</h1>
    //   <p>Pick a name for your fortress. It cannot be changed later.</p>
    //   <input
    //     value={fortressName}
    //     onChange={(e) => setFortressName(e.target.value)}
    //   />
    //   <p>Mint price: 0.1 Ξ</p>
    //   <div>
    //     {txBeingSent != null && (
    //       <>
    //         <ProgressBar width={385} percent={progress ?? 0} />
    //         <WaitingForTransactionMessage txHash={txBeingSent} />
    //       </>
    //     )}

    //     {transactionError != null && (
    //       <TransactionErrorMessage
    //         message={
    //           transactionError.data
    //             ? transactionError.data.message
    //             : transactionError.message
    //         }
    //         dismiss={() => setTransactionError(undefined)}
    //       />
    //     )}
    //   </div>
    // </Window>
  );
};
