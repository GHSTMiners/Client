import styles from "../styles.module.css"

function renderUpgradeElement(tier: number, index: number) {
    let upgradeColors: string[] = [ 
        '#7f63ff',
        '#33bacc',
        '#59bcff',
        '#ffc36b',
        '#ff96ff',
        '#51ffa8'];

    return (
        <div className={styles.upgradeElement}
             style={{ backgroundColor: upgradeColors[tier] }}
             key={`upgradeTier${index}`}>
        </div>
    );
}

export default renderUpgradeElement