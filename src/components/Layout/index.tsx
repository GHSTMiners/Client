import { ErrorModal } from "components";
import { useEffect } from "react";
import { useWeb3 } from "web3/context";
import styles from "./styles.module.css";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const {
    state: { error },
    dispatch,
  } = useWeb3();

  const handleCloseErrorModal = () => {
    dispatch({
      type: "SET_ERROR",
      error: undefined,
    });
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
      dispatch({
        type: "SET_ADDRESS",
        address: accounts[0],
      });
    });

    window.ethereum.on("chainChanged", (chainId: string) => {
      dispatch({
        type: "SET_NETWORK_ID",
        networkId: Number(chainId),
      });
    });
  }, []);

  // add this into the div and import Header class if required: <Header />
  return (
    <div className={styles.container}>
      {error && (
        <ErrorModal error={error} onHandleClose={handleCloseErrorModal} />
      )}

      {children}
    </div>
  );
};
