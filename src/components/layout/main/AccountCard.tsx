import Button from "./Button";

interface AccountCardProps {
    title: string;
    amount: number;
    description: string;
}

const AccountCard = ({title,amount,description}:AccountCardProps) => {
    return (
        <section className='account'>
            <div className='account-content-wrapper'>
                <h3 className='account-title'>{title}</h3>
                <p className='account-amount'>${amount}</p>
                <p className='account-amount-description'>{description}</p>
            </div>
            <div className='account-content-wrapper cta'>
                <Button type='transaction-button' message='View transactions' />
            </div>
        </section>
    );
};

export default AccountCard;
