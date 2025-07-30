// Shared constants for packages and services to ensure consistency across the application

export const PACKAGES: Record<string, Record<string, { price: number; includes: string[] }>> = {
  'Essentials': {
    'Under 1500 sq.ft.': { 
      price: 279, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '1500-2500 sq.ft.': { 
      price: 329, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '2500-3500 sq.ft.': { 
      price: 379, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '3500-4500 sq.ft.': { 
      price: 429, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '4500-5500 sq.ft.': { 
      price: 479, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
  },
  'Essentials + 2D Floor Plans': {
    'Under 1500 sq.ft.': { 
      price: 349, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '1500-2500 sq.ft.': { 
      price: 399, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '2500-3500 sq.ft.': { 
      price: 449, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '3500-4500 sq.ft.': { 
      price: 499, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '4500-5500 sq.ft.': { 
      price: 549, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
  },
  'Essentials + Matterport Tour': {
    'Under 1500 sq.ft.': { 
      price: 399, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '1500-2500 sq.ft.': { 
      price: 449, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '2500-3500 sq.ft.': { 
      price: 499, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '3500-4500 sq.ft.': { 
      price: 549, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '4500-5500 sq.ft.': { 
      price: 599, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
  },
  'Essentials + Property Tour Video': {
    'Under 1500 sq.ft.': { 
      price: 479, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '1500-2500 sq.ft.': { 
      price: 529, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '2500-3500 sq.ft.': { 
      price: 579, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '3500-4500 sq.ft.': { 
      price: 629, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '4500-5500 sq.ft.': { 
      price: 679, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
  },
  'Marketing Pro': {
    'Under 1500 sq.ft.': { 
      price: 679, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '1500-2500 sq.ft.': { 
      price: 729, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '2500-3500 sq.ft.': { 
      price: 779, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '3500-4500 sq.ft.': { 
      price: 829, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '4500-5500 sq.ft.': { 
      price: 879, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
  },
  'Top Agent': {
    'Under 1500 sq.ft.': { 
      price: 799, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '1500-2500 sq.ft.': { 
      price: 849, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '2500-3500 sq.ft.': { 
      price: 899, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '3500-4500 sq.ft.': { 
      price: 949, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '4500-5500 sq.ft.': { 
      price: 999, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
  },
};

export const SERVICE_CATALOG: Record<string, Array<{ name: string; price: number }>> = {
  'Under 1500 sq.ft.': [
    { name: 'HDR Photography', price: 169 },
    { name: 'Matterport 3D Tour', price: 199 },
    { name: 'Property Highlights Video', price: 289 },
    { name: 'Slideshow Video Tour', price: 99 },
    { name: 'Social Media Reel', price: 229 },
    { name: 'Drone Aerial Photos', price: 159 },
    { name: 'Drone Aerial Video', price: 159 },
    { name: 'Drone Photos + Video', price: 199 },
    { name: '2D Floor Plans', price: 119 },
    { name: '3D House Model', price: 159 },
    { name: 'Property Website', price: 129 },
    { name: 'Custom Domain Name', price: 39 },
    { name: 'Virtual Declutter', price: 29 },
    { name: 'Virtual Staging', price: 39 },
    { name: 'Virtual Twilight', price: 49 },
  ],
  '1500-2500 sq.ft.': [
    { name: 'HDR Photography', price: 229 },
    { name: 'Matterport 3D Tour', price: 239 },
    { name: 'Property Highlights Video', price: 309 },
    { name: 'Slideshow Video Tour', price: 99 },
    { name: 'Social Media Reel', price: 249 },
    { name: 'Drone Aerial Photos', price: 159 },
    { name: 'Drone Aerial Video', price: 159 },
    { name: 'Drone Photos + Video', price: 199 },
    { name: '2D Floor Plans', price: 149 },
    { name: '3D House Model', price: 199 },
    { name: 'Property Website', price: 129 },
    { name: 'Custom Domain Name', price: 39 },
    { name: 'Virtual Declutter', price: 29 },
    { name: 'Virtual Staging', price: 39 },
    { name: 'Virtual Twilight', price: 49 },
  ],
  '2500-3500 sq.ft.': [
    { name: 'HDR Photography', price: 289 },
    { name: 'Matterport 3D Tour', price: 279 },
    { name: 'Property Highlights Video', price: 329 },
    { name: 'Slideshow Video Tour', price: 99 },
    { name: 'Social Media Reel', price: 269 },
    { name: 'Drone Aerial Photos', price: 159 },
    { name: 'Drone Aerial Video', price: 159 },
    { name: 'Drone Photos + Video', price: 199 },
    { name: '2D Floor Plans', price: 179 },
    { name: '3D House Model', price: 239 },
    { name: 'Property Website', price: 129 },
    { name: 'Custom Domain Name', price: 39 },
    { name: 'Virtual Declutter', price: 29 },
    { name: 'Virtual Staging', price: 39 },
    { name: 'Virtual Twilight', price: 49 },
  ],
  '3500-4500 sq.ft.': [
    { name: 'HDR Photography', price: 349 },
    { name: 'Matterport 3D Tour', price: 319 },
    { name: 'Property Highlights Video', price: 349 },
    { name: 'Slideshow Video Tour', price: 99 },
    { name: 'Social Media Reel', price: 289 },
    { name: 'Drone Aerial Photos', price: 159 },
    { name: 'Drone Aerial Video', price: 159 },
    { name: 'Drone Photos + Video', price: 199 },
    { name: '2D Floor Plans', price: 209 },
    { name: '3D House Model', price: 279 },
    { name: 'Property Website', price: 129 },
    { name: 'Custom Domain Name', price: 39 },
    { name: 'Virtual Declutter', price: 29 },
    { name: 'Virtual Staging', price: 39 },
    { name: 'Virtual Twilight', price: 49 },
  ],
  '4500-5500 sq.ft.': [
    { name: 'HDR Photography', price: 409 },
    { name: 'Matterport 3D Tour', price: 359 },
    { name: 'Property Highlights Video', price: 369 },
    { name: 'Slideshow Video Tour', price: 99 },
    { name: 'Social Media Reel', price: 309 },
    { name: 'Drone Aerial Photos', price: 159 },
    { name: 'Drone Aerial Video', price: 159 },
    { name: 'Drone Photos + Video', price: 199 },
    { name: '2D Floor Plans', price: 239 },
    { name: '3D House Model', price: 319 },
    { name: 'Property Website', price: 129 },
    { name: 'Custom Domain Name', price: 39 },
    { name: 'Virtual Declutter', price: 29 },
    { name: 'Virtual Staging', price: 39 },
    { name: 'Virtual Twilight', price: 49 },
  ],
};

// Helper function to convert specific property size to range for pricing
export function getPropertySizeRange(size: string | number): string {
  if (!size) return 'Under 1500 sq.ft.'; // Default fallback
  
  let sizeNum: number;
  
  // If it's already a range format, return it if it matches our format
  if (typeof size === 'string' && size.includes('sq.ft.')) {
    // Validate it's a known range
    const validRanges = ['Under 1500 sq.ft.', '1500-2500 sq.ft.', '2500-3500 sq.ft.', '3500-4500 sq.ft.', '4500-5500 sq.ft.'];
    if (validRanges.includes(size)) {
      return size;
    }
    // If it's not a valid range, try to parse it
    sizeNum = parseInt(size.replace(/[^0-9]/g, ''));
  } else if (typeof size === 'string') {
    sizeNum = parseInt(size.replace(/[^0-9]/g, ''));
  } else {
    sizeNum = size;
  }
  
  // If we couldn't parse a number, return default
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return 'Under 1500 sq.ft.';
  }
  
  // Convert number to appropriate range using updated ranges
  if (sizeNum < 1500) return 'Under 1500 sq.ft.';
  if (sizeNum < 2500) return '1500-2500 sq.ft.';
  if (sizeNum < 3500) return '2500-3500 sq.ft.';
  if (sizeNum < 4500) return '3500-4500 sq.ft.';
  return '4500-5500 sq.ft.';
}

// Helper function to format property size for display
export function formatPropertySizeDisplay(size: string | number): string {
  if (!size) return 'Not specified';
  
  // If it's already a range format with sq.ft., return it
  if (typeof size === 'string' && size.includes('sq.ft.')) {
    return size;
  }
  
  // If it's a number or numeric string, format it as a specific size
  let sizeNum: number;
  if (typeof size === 'string') {
    sizeNum = parseInt(size.replace(/[^0-9]/g, ''));
  } else {
    sizeNum = size;
  }
  
  if (isNaN(sizeNum)) return 'Not specified';
  
  return `${sizeNum.toLocaleString()} sq ft (${getPropertySizeRange(sizeNum)})`;
}

// Helper function to calculate service pricing based on property size
export function calculateServicePricing(services: any[], propertySize: string | number) {
  const sizeRange = getPropertySizeRange(propertySize);
  const packageNames = Object.keys(PACKAGES);
  
  let totalPrice = 0;
  let formattedServices: string[] = [];
  
  services.forEach((service: any) => {
    if (packageNames.includes(service.name)) {
      // It's a package
      const packageInfo = PACKAGES[service.name]?.[sizeRange];
      if (packageInfo) {
        const count = service.count || 1;
        const serviceTotal = packageInfo.price * count;
        totalPrice += serviceTotal;
        
        formattedServices.push(
          `📦 ${service.name} (${sizeRange})${count > 1 ? ` x${count}` : ''} - $${serviceTotal.toFixed(2)}`
        );
      }
    } else {
      // It's an individual service
      const count = service.count || 1;
      const serviceTotal = service.total || (service.price * count);
      totalPrice += serviceTotal;
      
      formattedServices.push(
        `• ${service.name}${count > 1 ? ` (x${count})` : ''} - $${serviceTotal.toFixed(2)}`
      );
    }
  });
  
  return {
    totalPrice,
    formattedServices: formattedServices.join('\n')
  };
}

// Enhanced pricing calculation with validation and proper service handling
export function calculateBookingPricing(services: any[], propertySize: string | number): {
  services: any[];
  totalAmount: number;
  errors: string[];
} {
  if (!services || !Array.isArray(services)) {
    return {
      services: [],
      totalAmount: 0,
      errors: ['Invalid services array']
    };
  }

  const sizeRange = getPropertySizeRange(propertySize);
  const packageNames = Object.keys(PACKAGES);
  const errors: string[] = [];
  let totalAmount = 0;
  const updatedServices: any[] = [];

  services.forEach((service: any, index: number) => {
    if (!service || !service.name) {
      errors.push(`Service at index ${index} is invalid - missing name`);
      return;
    }

    const count = Math.max(1, service.count || 1);
    let servicePrice = 0;
    let updatedService = { ...service, count };

    if (packageNames.includes(service.name)) {
      // It's a package
      const packageInfo = PACKAGES[service.name]?.[sizeRange];
      if (packageInfo) {
        servicePrice = packageInfo.price;
        updatedService = {
          ...updatedService,
          price: packageInfo.price,
          total: packageInfo.price * count,
          type: 'package',
          includes: packageInfo.includes
        };
      } else {
        errors.push(`Package "${service.name}" not found for property size ${sizeRange}`);
        return;
      }
    } else {
      // It's an individual service
      const serviceInfo = SERVICE_CATALOG[sizeRange]?.find(s => s.name === service.name);
      if (serviceInfo) {
        servicePrice = serviceInfo.price;
        updatedService = {
          ...updatedService,
          price: serviceInfo.price,
          total: serviceInfo.price * count,
          type: 'service'
        };
      } else {
        // Check if it's a custom service with existing price
        if (service.price && typeof service.price === 'number' && service.price > 0) {
          servicePrice = service.price;
          updatedService = {
            ...updatedService,
            price: service.price,
            total: service.price * count,
            type: 'custom'
          };
        } else {
          errors.push(`Service "${service.name}" not found in catalog for property size ${sizeRange} and no valid custom price provided`);
          return;
        }
      }
    }

    totalAmount += servicePrice * count;
    updatedServices.push(updatedService);
  });

  return {
    services: updatedServices,
    totalAmount,
    errors
  };
}

// Helper to normalize property size to range format
export function normalizePropertySize(size: string | number): string {
  return getPropertySizeRange(size);
}

// Helper to validate booking data before saving
export function validateBookingData(bookingData: any): {
  isValid: boolean;
  errors: string[];
  normalizedData: any;
} {
  const errors: string[] = [];
  const normalizedData = { ...bookingData };

  // Normalize property size
  if (bookingData.property_size) {
    normalizedData.property_size = normalizePropertySize(bookingData.property_size);
  }

  // Validate and recalculate services pricing
  if (bookingData.services && bookingData.property_size) {
    const servicesArray = Array.isArray(bookingData.services) 
      ? bookingData.services 
      : typeof bookingData.services === 'string' 
        ? JSON.parse(bookingData.services) 
        : [];

    const pricingResult = calculateBookingPricing(servicesArray, normalizedData.property_size);
    
    if (pricingResult.errors.length > 0) {
      errors.push(...pricingResult.errors);
    } else {
      normalizedData.services = pricingResult.services;
      normalizedData.total_amount = pricingResult.totalAmount;
    }
  }

  // Validate required fields
  if (!normalizedData.agent_name || normalizedData.agent_name.trim() === '') {
    errors.push('Agent name is required');
  }

  if (!normalizedData.agent_email || normalizedData.agent_email.trim() === '') {
    errors.push('Agent email is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedData
  };
} 