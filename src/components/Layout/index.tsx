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
    const changeAccount = (accounts: Array<string>) => {
      dispatch({
        type: "SET_ADDRESS",
        address: accounts[0],
      })};

    const changeChain = (chainId: string) => {
      dispatch({
        type: "SET_NETWORK_ID",
        networkId: Number(chainId),
      });
    }

    window.ethereum.on("accountsChanged", changeAccount);
    window.ethereum.on("chainChanged", changeChain );

    return () => {
      window.ethereum.off("accountsChanged", changeAccount);
      window.ethereum.off("chainChanged", changeChain );
    }

  }, [dispatch]);

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
