import React from "react";

function usePageBottom() {
  const [bottom, setBottom] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      setBottom(isBottom);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("unmount"); // will be called when the component going to be unmounted
    };
  }, []);

  return bottom;
}

export default usePageBottom;
