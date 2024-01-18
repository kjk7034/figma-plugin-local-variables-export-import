import "./LoadingSpinner.css";

const LoadingSpinner = () => (
  <div className="lds-spinner">
    {[...Array(12)].map((_, index) => (
      <div key={index}></div>
    ))}
  </div>
);

export default LoadingSpinner;
