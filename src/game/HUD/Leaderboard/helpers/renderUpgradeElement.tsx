import styles from "../styles.module.css"

// Upgrade color array for all the defined tiers
let upgradeColors: string[] = [];
upgradeColors.push('#7f63ff');
upgradeColors.push('#33bacc');
upgradeColors.push('#59bcff');
upgradeColors.push('#ffc36b');
upgradeColors.push('#ff96ff');
upgradeColors.push('#51ffa8');

function renderUpgradeElement(tier: number, index: number) {
    return (
        <div className={styles.upgradeElement}
             style={{ backgroundColor: upgradeColors[tier] }}
             key={`upgradeTier${index}`}>
        </div>
    );
}

export default renderUpgradeElement