import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

let acronyms = [
  {
    acronym: "AEMO",
    full: "Australian Energy Market Operator",
    category: "Market Operator",
    description: "Operates the NEM, GBB, STTM, DWGM, WEM, GSH, and DAA.",
    related: ["NEM", "GBB", "DWGM", "STTM", "WEM", "GSH", "DAA"]
  },
  {
    acronym: "AER",
    full: "Australian Energy Regulator",
    category: "Regulator",
    description: "Regulates wholesale electricity and gas markets, and energy networks.",
    related: ["AEMC", "ACCC", "NEM"]
  },
  {
    acronym: "AEMC",
    full: "Australian Energy Market Commission",
    category: "Regulator",
    description: "Makes and amends the rules for the NEM and provides market development advice.",
    related: ["AER", "AEMO", "NEM"]
  },
  {
    acronym: "ACCC",
    full: "Australian Competition and Consumer Commission",
    category: "Regulator",
    description: "Ensures compliance with competition and consumer laws, including in energy markets.",
    related: ["AER", "AEMC"]
  },
  {
    acronym: "NEM",
    full: "National Electricity Market",
    category: "Electricity Market",
    description: "Covers the east coast electricity grid.",
    related: ["AEMO", "AEMC", "AER"]
  },
  {
    acronym: "GBB",
    full: "Gas Bulletin Board",
    category: "Gas Market",
    description: "Information platform for gas market transparency.",
    related: ["AEMO", "DWGM"]
  },
  {
    acronym: "DWGM",
    full: "Declared Wholesale Gas Market",
    category: "Gas Market",
    description: "Victoria’s gas balancing market operated by AEMO.",
    related: ["AEMO", "GBB"]
  },
  {
    acronym: "STTM",
    full: "Short Term Trading Market",
    category: "Gas Market",
    description: "Market for trading natural gas at defined hubs in Adelaide, Sydney, and Brisbane.",
    related: ["AEMO", "GBB"]
  },
  {
    acronym: "WEM",
    full: "Wholesale Electricity Market",
    category: "Electricity Market",
    description: "Electricity market in Western Australia operated by AEMO.",
    related: ["AEMO"]
  },
  {
    acronym: "GSH",
    full: "Gas Supply Hub",
    category: "Gas Market",
    description: "Trading platform for short-term gas supply.",
    related: ["AEMO", "STTM"]
  },
  {
    acronym: "DAA",
    full: "Day Ahead Auction",
    category: "Gas Market",
    description: "Mechanism for auctioning spare pipeline capacity on a daily basis.",
    related: ["AEMO", "GSH"]
  }
];

function extractAcronymsFromText(text) {
  const regex = /\b([A-Z]{2,6})\b\s*[-–—:]?\s*(.*?)(?=\n|\.|$)/g;
  const matches = [...text.matchAll(regex)];
  return matches
    .map(([_, acronym, full]) => ({
      acronym,
      full,
      category: "To Review",
      description: full,
      related: []
    }))
    .filter(item => item.full && item.acronym && !acronyms.some(existing => existing.acronym === item.acronym));
}

export default function AcronymApp() {
  const [search, setSearch] = useState("");
  const [textInput, setTextInput] = useState("");
  const [autoAcronyms, setAutoAcronyms] = useState([]);

  const handleExtract = () => {
    const extracted = extractAcronymsFromText(textInput);
    setAutoAcronyms(extracted);
  };

  const handleSave = (item) => {
    acronyms = [...acronyms, item];
    setAutoAcronyms((prev) => prev.filter((a) => a.acronym !== item.acronym));
  };

  const handleEditChange = (index, key, value) => {
    const updated = [...autoAcronyms];
    updated[index][key] = value;
    setAutoAcronyms(updated);
  };

  const filtered = acronyms.filter((item) =>
    item.acronym.toLowerCase().includes(search.toLowerCase()) ||
    item.full.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Australian Energy Acronyms</h1>
      <Input
        type="text"
        placeholder="Search acronyms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map((item) => (
          <Card key={item.acronym}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{item.acronym}</h2>
              <p className="text-sm text-gray-600">{item.full}</p>
              <p className="mt-2 text-sm">{item.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Category:</strong> {item.category}<br />
                <strong>Related:</strong> {item.related.join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Paste Text to Extract Acronyms</h2>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste industry text here..."
          className="w-full h-40 p-2 border rounded mb-2"
        />
        <button
          onClick={handleExtract}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Extract Acronyms
        </button>
      </div>

      {autoAcronyms.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Extracted Acronyms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoAcronyms.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <Input
                    className="mb-1"
                    value={item.acronym}
                    onChange={(e) => handleEditChange(index, 'acronym', e.target.value)}
                    placeholder="Acronym"
                  />
                  <Input
                    className="mb-1"
                    value={item.full}
                    onChange={(e) => handleEditChange(index, 'full', e.target.value)}
                    placeholder="Full meaning"
                  />
                  <Input
                    className="mb-1"
                    value={item.description}
                    onChange={(e) => handleEditChange(index, 'description', e.target.value)}
                    placeholder="Description"
                  />
                  <Input
                    className="mb-1"
                    value={item.category}
                    onChange={(e) => handleEditChange(index, 'category', e.target.value)}
                    placeholder="Category"
                  />
                  <Input
                    className="mb-2"
                    value={item.related.join(", ")}
                    onChange={(e) => handleEditChange(index, 'related', e.target.value.split(",").map(s => s.trim()))}
                    placeholder="Related (comma-separated)"
                  />
                  <button
                    onClick={() => handleSave(item)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save to List
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
