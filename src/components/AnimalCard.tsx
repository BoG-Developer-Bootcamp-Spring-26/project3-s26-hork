import React, { useEffect, useState } from 'react';

interface AnimalCardProps {
  animal: {
    _id: string;
    name: string;
    breed: string;
    owner: string;
    hoursTrained?: number;
    profilePicture?: string;
  };
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  const isId = animal.owner.length === 24;
  const [ownerName, setOwnerName] = useState(isId ? '' : animal.owner);

  useEffect(() => {
    if (!isId) return;
    fetch(`/api/user?id=${animal.owner}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.userData?.fullName) setOwnerName(data.userData.fullName);
      });
  }, [animal.owner, isId]);

  const ownerInitial = ownerName.charAt(0).toUpperCase();

  return (
    <div className="w-full bg-white rounded-[30px] shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-[1.02]">
      
      <div className="h-40 w-full relative"> 
        <img 
          src="/images/animalPicture.png"
          alt={animal.name}
          className="w-full h-full object-cover"
        />
      </div>


      <div className="p-6 py-4 flex items-start gap-4">

        <div className="w-10 h-10 bg-[#C23127] rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
          {ownerInitial}
        </div>

        <div className="flex flex-col min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {animal.name} - {animal.breed}
          </h2>
          
          <div className="flex items-center text-gray-400 text-[13px] mt-0.5 font-medium tracking-tight">
            <span className="truncate max-w-50">{ownerName}</span>
            <span className="mx-2 text-gray-300 font-black">•</span>
            <span className="shrink-0">Trained: {animal.hoursTrained ?? 0} hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
