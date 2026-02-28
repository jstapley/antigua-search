// REPLACE THE LISTINGS DISPLAY SECTION WITH THIS:
// Find the section that starts with {loadingData ? and replace everything 
// up to the closing bracket before {activeTab === 'claims' with this code:

{loadingData ? (
  <div className="text-center py-12">
    <p className="text-gray-600">Loading listings...</p>
  </div>
) : (
  <>
    {/* 📱 MOBILE CARD VIEW (< 768px) */}
    <div className="md:hidden space-y-4">
      {listings
        .filter(listing => {
          const matchesSearch = !listingSearch || 
            listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
            listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
            listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
          const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
          return matchesSearch && matchesStatus
        })
        .map(listing => (
          <div key={listing.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
            {/* Business Name - Large & Bold */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {listing.business_name}
            </h3>
            
            {/* Category & Parish - One Line */}
            <div className="flex gap-3 mb-3 text-sm">
              <span className="text-gray-600">
                {listing.category?.icon_emoji} {listing.category?.name}
              </span>
              <span className="text-gray-500">• {listing.parish?.name}</span>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                listing.status === 'active' 
                  ? 'bg-green-100 text-green-700'
                  : listing.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {listing.status.toUpperCase()}
              </span>
            </div>

            {/* 🎯 BIG ACTION BUTTONS */}
            <div className="space-y-2">
              {/* Approve/Reject for Pending */}
              {listing.status === 'pending' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApproveListing(listing.id, listing.business_name)}
                    disabled={loadingListing === listing.id}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3.5 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition text-base"
                  >
                    <Check className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectListing(listing.id, listing.business_name)}
                    disabled={loadingListing === listing.id}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3.5 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 transition text-base"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
              
              {/* Set Pending for Active */}
              {listing.status === 'active' && (
                <button
                  onClick={() => handleSetPending(listing.id, listing.business_name)}
                  disabled={loadingListing === listing.id}
                  className="w-full bg-yellow-600 text-white px-4 py-3.5 rounded-lg font-bold hover:bg-yellow-700 disabled:bg-gray-400 transition text-base"
                >
                  Set Pending Review
                </button>
              )}

              {/* Approve for Rejected */}
              {listing.status === 'rejected' && (
                <button
                  onClick={() => handleApproveListing(listing.id, listing.business_name)}
                  disabled={loadingListing === listing.id}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-4 py-3.5 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition text-base"
                >
                  <Check className="w-5 h-5" />
                  Approve Listing
                </button>
              )}

              {/* Secondary Actions Row */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <Link
                  href={`/listing/${listing.slug}`}
                  target="_blank"
                  className="flex-1 text-center bg-indigo-100 text-indigo-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-indigo-200 transition text-sm"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/edit/${listing.id}`}
                  className="flex-1 text-center bg-blue-100 text-blue-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-blue-200 transition text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteListing(listing.id, listing.business_name)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-red-200 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* No Results for Mobile */}
      {listings.filter(listing => {
        const matchesSearch = !listingSearch || 
          listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
          listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
          listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
        const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
        return matchesSearch && matchesStatus
      }).length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setListingSearch('')
              setStatusFilter('all')
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>

    {/* 💻 DESKTOP TABLE VIEW (≥ 768px) - KEEP YOUR EXISTING TABLE */}
    <div className="hidden md:block bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* YOUR EXISTING TABLE CODE GOES HERE - DON'T CHANGE IT */}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Business</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Parish</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {listings
            .filter(listing => {
              const matchesSearch = !listingSearch || 
                listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
              const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
              return matchesSearch && matchesStatus
            })
            .map(listing => (
            <tr key={listing.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">{listing.business_name}</div>
                <div className="text-sm text-gray-500">{listing.slug}</div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm">
                  {listing.category?.icon_emoji} {listing.category?.name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {listing.parish?.name}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  listing.status === 'active' 
                    ? 'bg-green-100 text-green-700'
                    : listing.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {listing.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {listing.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveListing(listing.id, listing.business_name)}
                        disabled={loadingListing === listing.id}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectListing(listing.id, listing.business_name)}
                        disabled={loadingListing === listing.id}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {listing.status === 'active' && (
                    <button
                      onClick={() => handleSetPending(listing.id, listing.business_name)}
                      disabled={loadingListing === listing.id}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      Set Pending
                    </button>
                  )}

                  {listing.status === 'rejected' && (
                    <button
                      onClick={() => handleApproveListing(listing.id, listing.business_name)}
                      disabled={loadingListing === listing.id}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                  )}

                  <Link
                    href={`/listing/${listing.slug}`}
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/edit/${listing.id}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing.id, listing.business_name)}
                    className="text-red-600 hover:text-red-700 font-semibold text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No Results for Desktop */}
      {listings.filter(listing => {
        const matchesSearch = !listingSearch || 
          listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
          listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
          listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
        const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
        return matchesSearch && matchesStatus
      }).length === 0 && (
        <div className="p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setListingSearch('')
              setStatusFilter('all')
            }}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  </>
)}