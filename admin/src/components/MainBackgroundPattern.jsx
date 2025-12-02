const MainBackgroundPattern = () => {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
        backgroundSize: '40px 40px',
      }}
    ></div>
  );
};

export default MainBackgroundPattern;
