import Image from "next/image";

// Dados de exemplo para os animais.
// Numa aplicação real, estes dados viriam de uma API ou base de dados.
const pets = [
	{
		id: 1,
		name: "GATO",
		location: "PORTO ALEGRE, RS",
		imageUrl: "https://png.pngtree.com/png-vector/20240909/ourmid/pngtree-dog-cartoon-png-image_13801648.png",
		type: "Gato",
	},
	{
		id: 2,
		name: "CACHORRO",
		location: "GRAVATAI, RS",
		imageUrl: "https://png.pngtree.com/png-vector/20240909/ourmid/pngtree-dog-cartoon-png-image_13801648.png",
		type: "Cachorro",
	},
	{
		id: 3,
		name: "CACHORRO E DOG",
		location: "CANOAS, RS",
		imageUrl: "https://png.pngtree.com/png-vector/20240909/ourmid/pngtree-dog-cartoon-png-image_13801648.png",
		type: "Cachorro",
	},
	{
		id: 4,
		name: "CACHORRO",
		location: "PORTO ALEGRE, RS",
		imageUrl: "https://png.pngtree.com/png-vector/20240909/ourmid/pngtree-dog-cartoon-png-image_13801648.png",
		type: "Cachorro",
	},
	{
		id: 5,
		name: "GATO",
		location: "SAPUCAIA DO SUL, RS",
		imageUrl: "https://png.pngtree.com/png-vector/20240909/ourmid/pngtree-dog-cartoon-png-image_13801648.png",
		type: "Gato",
	},
	{
		id: 6,
		name: "GATO",
		location: "SAO LEOPOLDO, RS",
		imageUrl: "https://png.pngtree.com/png-vector/20240909/ourmid/pngtree-dog-cartoon-png-image_13801648.png",
		type: "Gato",
	},
];

// Componente para a barra de navegação
const Navbar = () => (
	<nav className="flex items-center p-4 bg-[#963676] border-b border-gray-300 w-full">
		{/* Logo à esquerda, bem no canto */}
		<div className="flex-shrink-0">
			{/* Use public/logo.png — substitua por seu arquivo real */}
			<Image
				src="/logo.png"
				alt="Logo"
				width={160}
				height={160}
				className="rounded-full p-1"
			/>
		</div>

		<div className="flex ml-auto gap-2">
			<button className="bg-white text-[#963676] px-4 py-2 rounded-lg">LOGIN</button>
			<button className="bg-white text-[#963676] px-4 py-2 rounded-lg">
				CADASTRAR-SE
			</button>
		</div>
	</nav>
);

// Componente para um item de filtro
const FilterItem = ({ label }) => (
	<div className="mb-4">
		<label className="block text-sm font-semibold mb-1">{label}</label>
		<select className="w-full p-2 border border-gray-300 rounded-lg">
			<option>TIPO 1 (SELECT BOX)</option>
		</select>
	</div>
);

// Componente para o cartão do animal
const PetCard = ({ name, location, imageUrl }) => (
	<div className="bg-white rounded-lg shadow-md overflow-hidden p-2 flex flex-col items-center border border-pink-400">
		<Image
			src={imageUrl}
			alt={`Foto de ${name}`}
			width={200}
			height={200}
			className="rounded-lg mb-2"
		/>
		<h3 className="text-lg font-bold">{name}</h3>
		<div className="flex items-center text-gray-800 text-sm">
			<span className="mr-1">📍</span>
			<span>{location}</span>
		</div>
	</div>
);

export default function Home() {
	return (
		<div className="bg-gray-50 min-h-screen text-gray-900">
			<Navbar />

			<div className="container mx-auto p-8 flex gap-8">
				{/* Barra Lateral de Filtros */}
				<aside className="w-1/4 p-6 bg-white rounded-lg shadow-md border border-gray-300">
					<h2 className="text-xl font-bold mb-4">FILTRAR PETS</h2>
					<FilterItem label="ESPÉCIE" />
					<FilterItem label="CEP" />
					<FilterItem label="RAÇA" />
					<FilterItem label="PORTE" />
					<FilterItem label="SEXO" />

					<div className="mt-6 flex flex-col gap-2">
						<button className="w-full bg-red-500 text-white py-2 rounded-lg font-bold">
							FILTRAR
						</button>
						<button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold">
							LIMPAR FILTROS
						</button>
					</div>
				</aside>

				{/* Área de Conteúdo Principal */}
				<main className="flex-1">
					{/* Barra de Pesquisa */}
					<div className="mb-8 flex items-center bg-white p-2 rounded-lg shadow-md border border-gray-300">
						<input
							type="text"
							placeholder="Pesquisar..."
							className="flex-1 p-2 focus:outline-none"
						/>
						<span className="p-2 cursor-pointer">🔍</span>
					</div>

					{/* Grid de Cartões de Animais */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{pets.map((pet) => (
							<PetCard
								key={pet.id}
								name={pet.name}
								location={pet.location}
								imageUrl={pet.imageUrl}
							/>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}