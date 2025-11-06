"use client";

import { useMemo, useState, useEffect, ReactNode } from "react";
import { Review } from "@/app/lib/types";
import { Star, Users, ChevronDown, Utensils, Beer, Armchair, ConciergeBell, Banknote, Filter, ChevronUp } from 'lucide-react';

type KpiCardProps = {
  color: string
  title: string
  name?: string
  value: string | number
  icon: ReactNode
  className?: string
  type?: 'category' | 'top-rated' | ''
}

function KpiCard({ color, title, name = "", value, icon, className = "", type = "" }: KpiCardProps) {
  const border = `border-${color}-500`
  return (
    <div className={
      `${type === 'category' ? 'bg-slate-100' : 'bg-session'} 
      rounded-xl shadow-md p-6 border-l-4 
      ${border} 
      ${className}`
    }>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm text-muted mb-1 ${type === 'category' ? 'hidden md:block': ''}`}>{title}</p>
          <p className={`text-lg font-bold truncate ${type === 'top-rated' ? 'block' : 'hidden'}`}>{name}</p>
          <p className={`font-bold ${type === 'category' ? 'text-gray-800 text-xl' : 'text-accent text-3xl'}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  )
}


export default function ReviewsList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Review[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false) ;
  
  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews(): Promise<Review[] | undefined> {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: "GET",
      })

      if (!res.ok) {
        console.error("Erro ao buscar dados de reviews")
        return undefined
      }

      const json = await res.json()
      setData(json)
      return json
    } catch (error) {
      console.error('Error ao buscar dados de avaliações')
      return undefined
    } finally {
      setLoading(false)
    }
  }
  
  // Filter and sort data
  type SortField = "rating" | "food" | "drink" | "ambiance" | "service" | "price"

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(r => {
      const matchesSearch = r.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 'all' || 
        (filterRating === '4+' && r.rating >= 4) ||
        (filterRating === '3-4' && r.rating >= 3 && r.rating < 4) ||
        (filterRating === '<3' && r.rating < 3);
      return matchesSearch && matchesRating;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [data, searchTerm, filterRating, sortField, sortOrder]);

  const kpis = useMemo(() => {
    const totalReviews = filteredAndSortedData.length
    const avgRating = (filteredAndSortedData.reduce((sum, review) => sum + review.rating, 0) / filteredAndSortedData.length).toFixed(1)
    const topRated = filteredAndSortedData.reduce((max, review) => (review.rating > max.rating ? review : max), filteredAndSortedData[0])
    const avgFood = (filteredAndSortedData.reduce((sum, review) => sum + review.food, 0) / filteredAndSortedData.length).toFixed(1)
    const avgDrink = (filteredAndSortedData.reduce((sum, review) => sum + review.drink, 0) / filteredAndSortedData.length).toFixed(1)
    const avgService = (filteredAndSortedData.reduce((sum, review) => sum + review.service, 0) / filteredAndSortedData.length).toFixed(1)
    const avgAmbiance = (filteredAndSortedData.reduce((sum, review) => sum + review.ambiance, 0) / filteredAndSortedData.length).toFixed(1)
    const avgPrice = (filteredAndSortedData.reduce((sum, review) => sum + review.price, 0) / filteredAndSortedData.length).toFixed(1)

    return { totalReviews, avgRating, topRated, avgFood, avgDrink, avgService, avgAmbiance, avgPrice}
  }, [filteredAndSortedData])

  const users = useMemo(() => {
    const uniqueUsers = data.reduce<string[]>((list, review) => {
      if (!list.includes(review.user.name)) {
        list.push(review.user.name);
      }
      return list;
    }, []);

    return uniqueUsers;
  }, [data]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const StarRating = ({ rating }: { rating: string }) => {
    const stars = parseFloat(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} hidden md:block`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  const fields: SortField[] = ['food', 'drink', 'ambiance', 'service', 'price', 'rating']

  if (loading) return <p className="text-muted">Carregando dados...</p>


  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Avaliações</h1>

        {/* Filters and Search */}
        <div className="bg-session rounded-xl shadow-md p-6 mb-6">
          <button 
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-background transition-colors"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-semibold">Filtros e busca</span>
            </div>
            {filtersExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {filtersExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filtrar por usuário</label>
                <select 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="">Todos</option>
                  {users.map(user => (<option key={user} value={user}>{user}</option>))}
                </select>
                {/* <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                /> */}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filtrar por nota</label>
                <select
                  value={filterRating}
                  onChange={(e) => {
                    setFilterRating(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="all">Todos</option>
                  <option value="4+">4+</option>
                  <option value="3-4">3-4</option>
                  <option value="<3">3-</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Itens por página</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          <KpiCard 
            color="blue"
            title="Total de Avaliações"
            value={kpis.totalReviews}
            icon={<Users className="w-12 h-12 text-blue-500 opacity-80" />}
          />
          <KpiCard 
            color="green"
            title="Nota Média"
            value={kpis.avgRating}
            icon={<Star className="w-12 h-12 text-green-500 opacity-80" />}
          />
          
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 mb-8"> 
          <KpiCard 
            color="red"
            title="Nota Média - Comida"
            value={kpis.avgFood}
            icon={<Utensils className="w-8 h-8 text-red-500 opacity-80" />}
            type="category"
          />
          <KpiCard 
            color="yellow"
            title="Nota Média - Bebida"
            value={kpis.avgDrink}
            icon={<Beer className="w-8 h-8 text-yellow-500 opacity-80" />}
            type="category"
          />
          <KpiCard 
            color="blue"
            title="Nota Média - Ambiente"
            value={kpis.avgAmbiance}
            icon={<Armchair className="w-8 h-8 text-blue-500 opacity-80" />}
            type="category"
          />
          <KpiCard 
            color="gray"
            title="Nota Média - Serviço"
            value={kpis.avgService}
            icon={<ConciergeBell className="w-8 h-8 text-gray-500 opacity-80" />}
            type="category"
          />
          <KpiCard 
            color="green"
            title="Nota Média - Preço"
            value={kpis.avgPrice}
            icon={<Banknote className="w-8 h-8 text-green-500 opacity-80" />}
            type="category"
          />
          
        </div>



        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usuário</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Buteco</th>
                  {fields.map(field => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        <ChevronDown className={`w-4 h-4 transition-transform ${sortField === field ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'opacity-30'}`} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((review, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{review.buteco.name}</span>
                    </td>
                    <td className="px-6 py-4"><StarRating rating={review.food.toFixed(1)} /></td>
                    <td className="px-6 py-4"><StarRating rating={review.drink.toFixed(1)} /></td>
                    <td className="px-6 py-4"><StarRating rating={review.ambiance.toFixed(1)} /></td>
                    <td className="px-6 py-4"><StarRating rating={review.service.toFixed(1)} /></td>
                    <td className="px-6 py-4"><StarRating rating={review.price.toFixed(1)} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900">{review.rating}</span>
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {paginatedData.map((bar, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <p className="text-muted text-sm">{bar.user.name}</p>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">{bar.buteco.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <span className="font-bold text-lg text-gray-900">{bar.rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Food</span>
                    <StarRating rating={bar.food.toFixed(0)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Drinks</span>
                    <StarRating rating={bar.drink.toFixed(0)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Atmosphere</span>
                    <StarRating rating={bar.ambiance.toFixed(0)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service</span>
                    <StarRating rating={bar.service.toFixed(0)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price</span>
                    <StarRating rating={bar.price.toFixed(0)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              De {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} de {filteredAndSortedData.length} resultados
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1 lg:gap-2">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage <= 2) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 3 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
