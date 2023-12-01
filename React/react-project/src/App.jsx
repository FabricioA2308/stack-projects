import CoreConcepts from "./components/CoreConcepts.jsx";
import Header from "./components/Header/Header.jsx";
import Examples from "./components/Examples.jsx";

function App() {
  return (
    <>
      <Header />
      <main>
        <CoreConcepts />
        <Examples />
      </main>
    </>
  );
}

export default App;

/* {CORE_CONCEPTS.map((conceptItem) => {
  <CoreConcept key={conceptItem.title} {...conceptItem} />
})} */

/* {CORE_CONCEPTS.map((conceptItem) =>     
  <CoreConcept key={conceptItem.title} {...conceptItem} />
))} */
