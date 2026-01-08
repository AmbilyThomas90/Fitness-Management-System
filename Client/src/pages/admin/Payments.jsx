const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/admin/payments").then(res => setPayments(res.data));
  }, []);

  return (
    <>
      <h2>Payments</h2>
      {payments.map(p => (
        <div key={p._id}>
          {p.user.name} - ₹{p.amount} - {p.status}
        </div>
      ))}
    </>
  );
};

export default Payments;
