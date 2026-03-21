"""
AntiguaSearch.com — Google Places Seed Scraper
-----------------------------------------------
Uses the Places API (New) — required for projects created after March 2025.

Outputs: antigua_listings_seed.csv

Usage:
    pip install requests python-slugify
    python antigua_scraper.py

Set TARGET_TOTAL to control how many listings you want.
The script deduplicates by place_id across all searches.
"""

import csv
import time
import requests
from slugify import slugify

# ------------------------------------------------------------------ #
# CONFIG  — paste your key here
# ------------------------------------------------------------------ #

API_KEY      = "AIzaSyAcfi9SAA0cKz30nkSLMSEcS6roWX2hB4E"
TARGET_TOTAL = 10000
OUTPUT_FILE  = "antigua_listings_seed.csv"
DELAY        = 0.5    # seconds between API calls

# Places API (New) endpoints
TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
DETAILS_URL     = "https://places.googleapis.com/v1/places/{place_id}"

# ------------------------------------------------------------------ #
# PARISHES
# ------------------------------------------------------------------ #

PARISHES = [
    {"name": "Saint John's",  "slug": "st-johns"},
    {"name": "Saint Mary",    "slug": "st-mary"},
    {"name": "Saint Paul",    "slug": "st-paul"},
    {"name": "Saint George",  "slug": "st-george"},
    {"name": "Saint Philip",  "slug": "st-philip"},
    {"name": "Saint Peter",   "slug": "st-peter"},
]

# ------------------------------------------------------------------ #
# CATEGORY MAPPING  — Places API (New) primaryType values
# ------------------------------------------------------------------ #

GOOGLE_TYPE_MAP = {
    # Accommodation
    "lodging":                "accommodation",
    "hotel":                  "accommodation",
    "guest_house":            "accommodation",
    "extended_stay_hotel":    "accommodation",
    "bed_and_breakfast":      "accommodation",
    "resort_hotel":           "accommodation",
    "motel":                  "accommodation",
    "hostel":                 "accommodation",
    # Bars & Nightlife
    "bar":                    "nightlife",
    "night_club":             "nightlife",
    "cocktail_bar":           "nightlife",
    "wine_bar":               "nightlife",
    "pub":                    "nightlife",
    # Beauty & Wellness
    "beauty_salon":           "beauty-wellness",
    "hair_salon":             "beauty-wellness",
    "hair_care":              "beauty-wellness",
    "spa":                    "beauty-wellness",
    "gym":                    "beauty-wellness",
    "nail_salon":             "beauty-wellness",
    "massage":                "beauty-wellness",
    # Boating & Marine
    "marina":                 "boating-marine",
    "boat_rental":            "boating-marine",
    "boat_dealer":            "boating-marine",
    # Car Rental
    "car_rental":             "car-rental",
    # Construction & Trades
    "electrician":            "construction-trades",
    "plumber":                "construction-trades",
    "roofing_contractor":     "construction-trades",
    "general_contractor":     "construction-trades",
    "painter":                "construction-trades",
    "hardware_store":         "construction-trades",
    # Education
    "school":                 "education",
    "university":             "education",
    "primary_school":         "education",
    "secondary_school":       "education",
    "preschool":              "education",
    # Entertainment
    "movie_theater":          "entertainment",
    "amusement_park":         "entertainment",
    "casino":                 "entertainment",
    "bowling_alley":          "entertainment",
    "event_venue":            "entertainment",
    # Finance & Legal
    "bank":                   "finance-legal",
    "atm":                    "finance-legal",
    "insurance_agency":       "finance-legal",
    "lawyer":                 "finance-legal",
    "accounting":             "finance-legal",
    # Food & Groceries
    "grocery_store":          "food-groceries",
    "supermarket":            "food-groceries",
    "convenience_store":      "food-groceries",
    "bakery":                 "food-groceries",
    "liquor_store":           "food-groceries",
    # Government & Services
    "local_government_office": "government-services",
    "post_office":            "government-services",
    "police":                 "government-services",
    "fire_station":           "government-services",
    "embassy":                "government-services",
    # Health & Medical
    "hospital":               "health-medical",
    "doctor":                 "health-medical",
    "dentist":                "health-medical",
    "pharmacy":               "health-medical",
    "physiotherapist":        "health-medical",
    "veterinary_care":        "health-medical",
    # Home & Garden
    "furniture_store":        "home-garden",
    "home_goods_store":       "home-garden",
    "florist":                "home-garden",
    # Professional Services
    "moving_company":         "professional-services",
    "storage":                "professional-services",
    "travel_agency":          "professional-services",
    "laundry":                "professional-services",
    "dry_cleaning":           "professional-services",
    # Real Estate
    "real_estate_agency":     "real-estate",
    # Restaurants & Cafes
    "restaurant":             "restaurants-cafes",
    "cafe":                   "restaurants-cafes",
    "coffee_shop":            "restaurants-cafes",
    "fast_food_restaurant":   "restaurants-cafes",
    "meal_takeaway":          "restaurants-cafes",
    "seafood_restaurant":     "restaurants-cafes",
    "ice_cream_shop":         "restaurants-cafes",
    # Retail & Shopping
    "clothing_store":         "retail-shopping",
    "shoe_store":             "retail-shopping",
    "jewelry_store":          "retail-shopping",
    "electronics_store":      "retail-shopping",
    "book_store":             "retail-shopping",
    "shopping_mall":          "retail-shopping",
    "gift_shop":              "retail-shopping",
    # Sports & Recreation
    "stadium":                "sports-recreation",
    "sports_club":            "sports-recreation",
    "golf_course":            "sports-recreation",
    "fitness_center":         "sports-recreation",
    # Technology & IT
    "computer_store":         "technology-it",
    # Tours & Attractions
    "tourist_attraction":     "tours",
    "museum":                 "tours",
    "art_gallery":            "tours",
    "park":                   "beaches",
    "national_park":          "beaches",
    "historical_landmark":    "culture",
    # Transport & Logistics
    "taxi_stand":             "transportation",
    "bus_station":            "transportation",
    "airport":                "transportation",
    "car_repair":             "transportation",
    "gas_station":            "transportation",
    "ferry_terminal":         "transportation",
    "airport_taxi":           "transportation",
    "taxi_service":           "transportation",
    # Water Sports
    "diving_center":          "water-sports",
    "water_park":             "water-sports",
}

CATEGORY_SEARCHES = [
    # General
    "restaurants antigua", "hotels antigua", "bars antigua",
    "supermarkets antigua", "pharmacies antigua",
    "tours antigua", "water sports antigua", "taxis antigua",
    "transportation antigua", "banks antigua", "schools antigua",
    "hospitals antigua", "beauty salons antigua", "marinas antigua",
    "real estate antigua",
    # Tourism & Experiences
    "sailing charters antigua",
    "catamaran antigua",
    "snorkeling antigua",
    "diving antigua",
    "fishing charters antigua",
    "boat tours antigua",
    "kayaking antigua",
    "kitesurfing antigua",
    "paddleboarding antigua",
    "yacht charters antigua",
    "historic tours antigua",
    "hiking antigua",
    "eco tours antigua",
    # Accommodation
    "villas antigua",
    "vacation rentals antigua",
    "boutique hotels antigua",
    "guesthouses antigua",
    "resorts antigua",
    "airbnb antigua",
    # Food & Drink
    "beach bars antigua",
    "rum bars antigua",
    "catering antigua",
    "bakeries antigua",
    "seafood restaurants antigua",
    "caribbean restaurants antigua",
    "fine dining antigua",
    "food trucks antigua",
    # Professional Services
    "lawyers antigua",
    "accountants antigua",
    "dentists antigua",
    "architects antigua",
    "engineers antigua",
    "insurance antigua",
    "veterinarians antigua",
    # Retail & Trade
    "car dealerships antigua",
    "hardware stores antigua",
    "clothing stores antigua",
    "electronics antigua",
    "jewellery antigua",
    "gift shops antigua",
    "art galleries antigua",
    "duty free antigua",
    # Health & Wellness
    "yoga antigua",
    "massage antigua",
    "physiotherapy antigua",
    "clinics antigua",
    "opticians antigua",
    # Education
    "schools antigua",
    "tutoring antigua",
    "driving schools antigua",
    # Community & Services
    "churches antigua",
    "credit unions antigua",
    "laundry antigua",
    "car wash antigua",
    # Parish specific
    "businesses in English Harbour Antigua",
    "businesses in Falmouth Antigua",
    "businesses in Jolly Harbour Antigua",
    "businesses in Dickenson Bay Antigua",
    "restaurants English Harbour",
    "hotels English Harbour",
    "bars English Harbour",
    "restaurants Jolly Harbour",
    "hotels Jolly Harbour",
]

SEARCH_FIELD_MASK  = "places.id,places.displayName,places.formattedAddress,places.primaryType,places.types,places.location"
DETAILS_FIELD_MASK = "id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,regularOpeningHours,rating,userRatingCount,photos,location,primaryType,types,googleMapsUri"

# ------------------------------------------------------------------ #
# HELPERS
# ------------------------------------------------------------------ #

def api_headers(field_mask: str) -> dict:
    return {
        "Content-Type":    "application/json",
        "X-Goog-Api-Key":  API_KEY,
        "X-Goog-FieldMask": field_mask,
    }


def map_category(primary_type: str, types: list) -> str:
    if primary_type and primary_type in GOOGLE_TYPE_MAP:
        return GOOGLE_TYPE_MAP[primary_type]
    for t in types:
        if t in GOOGLE_TYPE_MAP:
            return GOOGLE_TYPE_MAP[t]
    return "professional-services"


def map_parish(address: str) -> dict:
    address_lower = address.lower()
    # Check common area names first
    area_map = {
        "english harbour": PARISHES[2],  # st-paul
        "falmouth":        PARISHES[2],  # st-paul
        "jolly harbour":   PARISHES[1],  # st-mary
        "five islands":    PARISHES[1],  # st-mary
        "dickenson bay":   PARISHES[0],  # st-johns
        "hodges bay":      PARISHES[5],  # st-peter
        "willoughby bay":  PARISHES[3],  # st-george
    }
    for area, parish in area_map.items():
        if area in address_lower:
            return parish
    for parish in PARISHES:
        if parish["name"].lower() in address_lower:
            return parish
    return PARISHES[0]  # default to St. John's


def build_photo_url(photo_name: str, max_width: int = 800) -> str:
    return (
        f"https://places.googleapis.com/v1/{photo_name}/media"
        f"?maxWidthPx={max_width}&key={API_KEY}&skipHttpRedirect=false"
    )


def build_slug(name: str, existing_slugs: set) -> str:
    base = slugify(name)
    slug = base
    counter = 1
    while slug in existing_slugs:
        slug = f"{base}-{counter}"
        counter += 1
    existing_slugs.add(slug)
    return slug


def format_hours(opening_hours: dict) -> str:
    if not opening_hours:
        return ""
    return " | ".join(opening_hours.get("weekdayDescriptions", []))


# ------------------------------------------------------------------ #
# API CALLS
# ------------------------------------------------------------------ #

def text_search(query: str, page_token: str = None) -> dict:
    body = {"textQuery": query, "pageSize": 20, "languageCode": "en"}
    if page_token:
        body["pageToken"] = page_token

    resp = requests.post(TEXT_SEARCH_URL, json=body, headers=api_headers(SEARCH_FIELD_MASK))

    if resp.status_code != 200:
        print(f"    → HTTP {resp.status_code}: {resp.text[:300]}")
        return {}

    data = resp.json()
    print(f"    → OK  |  results: {len(data.get('places', []))}")
    return data


def place_details(place_id: str) -> dict:
    url  = DETAILS_URL.format(place_id=place_id)
    resp = requests.get(url, headers=api_headers(DETAILS_FIELD_MASK))
    if resp.status_code != 200:
        print(f"    → Details HTTP {resp.status_code}: {resp.text[:200]}")
        return {}
    return resp.json()


# ------------------------------------------------------------------ #
# COLLECTION
# ------------------------------------------------------------------ #

def collect_place_ids(queries: list, target: int, collected: dict) -> dict:
    for query in queries:
        if len(collected) >= target:
            break

        print(f"  Searching: {query!r}  ({len(collected)}/{target} collected)")
        page_token = None

        for _ in range(3):
            if len(collected) >= target:
                break
            try:
                data = text_search(query, page_token)
            except Exception as e:
                print(f"    ⚠ Search error: {e}")
                break

            for place in data.get("places", []):
                pid = place.get("id")
                if pid and pid not in collected:
                    collected[pid] = query
                if len(collected) >= target:
                    break

            page_token = data.get("nextPageToken")
            if not page_token:
                break
            time.sleep(2)

        time.sleep(DELAY)

    return collected


# ------------------------------------------------------------------ #
# MAIN
# ------------------------------------------------------------------ #

def main():
    if not API_KEY:
        print("❌  Paste your Google Places API key into the API_KEY variable at the top of the script.")
        return

    print("\n🌴  AntiguaSearch — Google Places Scraper (New API)")
    print(f"    Target: {TARGET_TOTAL} listings\n")

    collected = {}

    print("── Phase 1: Parish sweep ──────────────────────────")
    parish_queries = []
    for p in PARISHES:
        parish_queries.extend([
            f"businesses in {p['name']} Antigua",
            f"restaurants in {p['name']} Antigua",
            f"hotels in {p['name']} Antigua",
            f"shops in {p['name']} Antigua",
            f"services in {p['name']} Antigua",
            f"attractions in {p['name']} Antigua",
            f"tours in {p['name']} Antigua",
        ])
    collected = collect_place_ids(parish_queries, TARGET_TOTAL, collected)
    print(f"  Phase 1 done: {len(collected)} unique place IDs\n")

    if len(collected) < TARGET_TOTAL:
        print("── Phase 2: Category fill ─────────────────────────")
        collected = collect_place_ids(CATEGORY_SEARCHES, TARGET_TOTAL, collected)
        print(f"  Phase 2 done: {len(collected)} unique place IDs\n")

    if not collected:
        print("⚠  No place IDs collected. Double-check your API key and that 'Places API (New)' is enabled in Google Cloud Console.")
        return

    print("── Fetching place details ─────────────────────────")
    rows = []
    existing_slugs = set()
    place_ids = list(collected.keys())[:TARGET_TOTAL]

    for i, place_id in enumerate(place_ids, 1):
        print(f"  [{i}/{len(place_ids)}] {place_id}")
        try:
            detail = place_details(place_id)
        except Exception as e:
            print(f"    ⚠ Error: {e}")
            continue

        if not detail:
            continue

        name         = detail.get("displayName", {}).get("text", "").strip()
        address      = detail.get("formattedAddress", "")
        phone        = detail.get("nationalPhoneNumber", "")
        website      = detail.get("websiteUri", "")
        rating       = detail.get("rating", "")
        review_count = detail.get("userRatingCount", 0)
        primary_type = detail.get("primaryType", "")
        types        = detail.get("types", [])
        geo          = detail.get("location", {})
        hours        = format_hours(detail.get("regularOpeningHours", {}))
        photos       = detail.get("photos", [])
        maps_uri     = detail.get("googleMapsUri", "")

        image_url = ""
        if photos:
            photo_name = photos[0].get("name", "")
            if photo_name:
                image_url = build_photo_url(photo_name)

        rows.append({
            "business_name":      name,
            "slug":               build_slug(name, existing_slugs),
            "category_slug":      map_category(primary_type, types),
            "parish_slug":        map_parish(address)["slug"],
            "parish_name":        map_parish(address)["name"],
            "address":            address,
            "phone":              phone,
            "website":            website,
            "average_rating":     rating,
            "review_count":       review_count,
            "hours_of_operation": hours,
            "image_url":          image_url,
            "latitude":           geo.get("latitude", ""),
            "longitude":          geo.get("longitude", ""),
            "google_place_id":    place_id,
            "google_maps_url":    maps_uri,
            "status":             "pending",
            "google_types_raw":   ", ".join(types),
        })

        time.sleep(DELAY)

    if not rows:
        print("\n⚠  No rows to write.")
        return

    fieldnames = [
        "business_name", "slug", "category_slug", "parish_slug", "parish_name",
        "address", "phone", "website", "average_rating", "review_count",
        "hours_of_operation", "image_url", "latitude", "longitude",
        "google_place_id", "google_maps_url", "status", "google_types_raw",
    ]

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n✅  Done! {len(rows)} listings written to {OUTPUT_FILE}")
    print("\nNext steps:")
    print("  1. Review CSV — check category/parish mappings look correct")
    print("  2. Import CSV into listings_staging table in Supabase")
    print("  3. Run enrich_descriptions.py to generate SEO descriptions")
    print("  4. Review staging table, set approved = true on good rows")
    print("  5. Run migrate_staging_to_listings.sql to go live")


if __name__ == "__main__":
    main()