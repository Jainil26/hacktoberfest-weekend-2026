export const SAMPLE_NOTES = [
  {
    id: "biology-photosynthesis",
    title: "Biology: Photosynthesis & Cellular Energy",
    category: "Science",
    content: `Photosynthesis is the fundamental biological process by which autotrophic organisms—such as green plants, algae, and cyanobacteria—convert light energy into chemical energy stored in glucose molecules.

The chemical equation for photosynthesis is:
6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2

Photosynthesis occurs inside specialized plant cell organelles called chloroplasts, which contain pigment molecules called chlorophyll. Chlorophyll primarily absorbs red and blue light wavelengths while reflecting green light.

Photosynthesis takes place in two distinct stages:

1. Light-Dependent Reactions (occurs in the thylakoid membranes):
- Chlorophyll absorbs photons of light.
- Water molecules (H2O) are split through photolysis, releasing molecular oxygen (O2) as a byproduct.
- Light energy generates ATP (adenosine triphosphate) and NADPH (nicotinamide adenine dinucleotide phosphate) via an electron transport chain.

2. Light-Independent Reactions / Calvin Cycle (occurs in the stroma):
- CO2 from the atmosphere is fixed by the enzyme RuBisCO.
- Using the energy stored in ATP and NADPH from the light stage, carbon dioxide is reduced to form Glyceraldehyde 3-phosphate (G3P), which synthesizes glucose.

Factors affecting the rate of photosynthesis include light intensity, CO2 concentration, ambient temperature, and water availability.`
  },
  {
    id: "cs-data-structures",
    title: "Computer Science: Arrays vs Linked Lists",
    category: "Tech",
    content: `In computer science, data structures determine how data is stored, organized, and accessed in memory. Arrays and Linked Lists are two foundational linear data structures with distinct trade-offs.

Arrays:
- A contiguous block of memory storing elements of the same type.
- Random access allows fast element retrieval in O(1) constant time via index arithmetic.
- Fixed sizing: Insertion or deletion requires shifting elements, leading to O(n) worst-case time complexity.
- Cache friendly due to spatial locality of continuous memory cells.

Linked Lists:
- Consists of nodes where each node contains data and a reference (pointer) to the next node in memory.
- Dynamic size: Can grow or shrink on demand without reallocation or unused capacity overhead.
- Sequential access: Finding an element at index i requires traversing nodes from head to node i in O(n) time.
- Insertion and deletion at a known position is fast O(1) because only pointer references need updating.
- Higher memory overhead per element due to node pointer storage.
- Types include Singly Linked List (next pointer only), Doubly Linked List (next and prev pointers), and Circular Linked List.`
  },
  {
    id: "history-industrial-revolution",
    title: "History: The First Industrial Revolution",
    category: "History",
    content: `The First Industrial Revolution (roughly 1760–1840) marked a monumental transition from hand production methods to machine-driven manufacturing, transforming agrarian societies into mechanized industrial economies. Originating in Great Britain, it later spread across Western Europe and North America.

Key Technological Innovations:
1. Steam Engine: James Watt improved Newcomen's steam engine design, enabling mechanical work powered by coal. Steam powered factories and revolutionized transportation with locomotives and steamships.
2. Mechanized Textile Production: Innovations like John Kay's Flying Shuttle, James Hargreaves' Spinning Jenny, and Richard Arkwright's Water Frame mechanized cotton spinning and weaving, drastically lowering textile costs.
3. Metallurgy and Iron Smelting: Abraham Darby's innovation of using coke instead of charcoal for iron smelting lowered production costs, providing sturdy building materials for machinery and railways.

Socio-Economic Impacts:
- Urbanization: Millions of rural farm laborers migrated to rapidly growing industrial cities (e.g., Manchester, Birmingham) seeking factory employment.
- Rise of Factory System: Centralized workplaces replaced home-based cottage industries, introducing structured work shifts and division of labor.
- Social Class Realignment: Emergence of the industrial capitalist class (factory owners) and the working class (proletariat).
- Harsh Working Conditions: Early factories featured 12–16 hour workdays, dangerous machinery, minimal safety standards, and widespread child labor. This catalyzed early labor unions and reform legislation such as the Factory Acts.`
  }
];
