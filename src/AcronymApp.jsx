import { useState } from 'react';
import { Input } from '~/components/ui/input';  // ShadCN/UI Input component
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';  // ShadCN/UI Card components

// Initial acronyms data
const initialAcronyms = [
  {
    acronym: "NEM",
    full: "National Electricity Market",
    description: "Covers the east coast electricity grid.",
    category: "Electricity Market",
    related: "AEMO, AEMC, AER",
  },
  {
    acronym: "AEMO",
    full: "Australian Energy Market Operator",
    description: "Operates the NEM and WEM.",
    category: "Energy Market",
    related: "NEM, AER",
  },
  {
    acronym: "AEMC",
    full: "Australian Energy Market Commission",
    description: "Sets rules for the NEM.",
    category: "Regulatory",
    related: "NEM, AEMO",
  },
  {
    acronym: "AER",
    full: "Australian Energy Regulator",
    description: "Regulates energy markets.",
    category: "Regulatory",
    related: "NEM, AEMO",
  },
  {
    acronym: "WEM",
    full: "Wholesale Electricity Market",
    description: "Western Australia's electricity market.",
    category: "Electricity Market",
    related: "AEMO",
  },
];

export default function AcronymApp() {
  const [acronymsList, setAcronymsList] = useState(initialAcronyms);  // Use state for acronyms
  const [search, setSearch] = useState("");
  const [textInput, setTextInput] = useState("");
  const [autoAcronyms, setAutoAcronyms] = useState([]);

  // Filter acronyms based on search input
  const filtered = acronymsList.filter((item) =>
    item.acronym.toLowerCase().includes(search.toLowerCase()) ||
    item.full.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  // Function to extract acronyms from text
  const extractAcronymsFromText = (text) => {
    const regex = /\b([A-Z]{2,6})\b\s*[-–—:]?\s*(.*?)(?=\n|\.|$)/g;
    const matches = [...text.matchAll(regex)];
    return matches.map((match) => ({
      acronym: match[1],
      full: match[2].trim(),
      description: match[2].trim(),
      category: "To Review",
      related: "",
    }));
  };

  const handleExtract = () => {
    const extracted = extractAcronymsFromText(textInput);
    setAutoAcronyms(extracted);
    setTextInput("");
  };

  const handleSave = (item) => {
    setAcronymsList((prev) => [...prev, item]);  // Properly update state
    setAutoAcronyms((prev) => prev.filter((a) => a.acronym !== item.acronym));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Australian Energy Acronyms</h1>
      <Input
        placeholder="Search acronyms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="grid gap-4">
        {filtered.map((item) => (
          <Card key={item.acronym}>
            <CardHeader>
              <CardTitle>{item.acronym}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Full Form:</strong> {item.full}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Related:</strong> {item.related}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Paste Text to Extract Acronyms</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Paste industry text here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleExtract}
        >
          Extract Acronyms
        </button>
        {autoAcronyms.map((item) => (
          <Card key={item.acronym} className="mt-4">
            <CardHeader>
              <CardTitle>{item.acronym}</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Full Form"
                value={item.full}
                onChange={(e) =>
                  setAutoAcronyms((prev) =>
                    prev.map((a) =>
                      a.acronym === item.acronym ? { ...a, full: e.target.value } : a
                    )
                  )
                }
              />
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  setAutoAcronyms((prev) =>
                    prev.map((a) =>
                      a.acronym === item.acronym ? { ...a, description: e.target.value } : a
                    )
                  )
                }
              />
              <Input
                placeholder="Category"
                value={item.category}
                onChange={(e) =>
                  setAutoAcronyms((prev) =>
                    prev.map((a) =>
                      a.acronym === item.acronym ? { ...a, category: e.target.value } : a
                    )
                  )
                }
              />
              <Input
                placeholder="Related Acronyms"
                value={item.related}
                onChange={(e) =>
                  setAutoAcronyms((prev) =>
                    prev.map((a) =>
                      a.acronym === item.acronym ? { ...a, related: e.target.value } : a
                    )
                  )
                }
              />
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => handleSave(item)}
              >
                Save to List
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
