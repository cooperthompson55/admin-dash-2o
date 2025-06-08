// Shared constants for packages and services to ensure consistency across the application

export const PACKAGES: Record<string, Record<string, { price: number; includes: string[] }>> = {
  'Essentials Package': {
    'Under 1500 sq.ft.': { price: 229.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '1500-2499 sq.ft.': { price: 289.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '2500-3499 sq.ft.': { price: 349.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '3500-4499 sq.ft.': { price: 389.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '4500-5499 sq.ft.': { price: 449.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
  },
  'Deluxe Tour Package': {
    'Under 1500 sq.ft.': { price: 489.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '1500-2499 sq.ft.': { price: 579.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '2500-3499 sq.ft.': { price: 649.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '3500-4499 sq.ft.': { price: 719.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '4500-5499 sq.ft.': { price: 799.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
  },
  'Marketing Pro Package': {
    'Under 1500 sq.ft.': { price: 829.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '1500-2499 sq.ft.': { price: 959.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '2500-3499 sq.ft.': { price: 1079.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '3500-4499 sq.ft.': { price: 1179.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '4500-5499 sq.ft.': { price: 1299.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
  },
  'Premium Seller Experience': {
    'Under 1500 sq.ft.': { price: 1069.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '1500-2499 sq.ft.': { price: 1199.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '2500-3499 sq.ft.': { price: 1319.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '3500-4499 sq.ft.': { price: 1419.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '4500-5499 sq.ft.': { price: 1539.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
  },
};

export const SERVICE_CATALOG: Record<string, Array<{ name: string; price: number }>> = {
  'Under 1500 sq.ft.': [
    { name: 'HDR Photography', price: 189.99 },
    { name: '360° Virtual Tour', price: 199.99 },
    { name: 'Property Highlights Video', price: 289.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 229.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 119.99 },
    { name: '3D House Model', price: 189.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '1500-2499 sq.ft.': [
    { name: 'HDR Photography', price: 249.99 },
    { name: '360° Virtual Tour', price: 239.99 },
    { name: 'Property Highlights Video', price: 309.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 249.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 149.99 },
    { name: '3D House Model', price: 229.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '2500-3499 sq.ft.': [
    { name: 'HDR Photography', price: 319.99 },
    { name: '360° Virtual Tour', price: 279.99 },
    { name: 'Property Highlights Video', price: 349.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 279.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 189.99 },
    { name: '3D House Model', price: 269.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '3500-4499 sq.ft.': [
    { name: 'HDR Photography', price: 379.99 },
    { name: '360° Virtual Tour', price: 319.99 },
    { name: 'Property Highlights Video', price: 379.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 299.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 229.99 },
    { name: '3D House Model', price: 299.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '4500-5499 sq.ft.': [
    { name: 'HDR Photography', price: 439.99 },
    { name: '360° Virtual Tour', price: 349.99 },
    { name: 'Property Highlights Video', price: 409.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 329.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 269.99 },
    { name: '3D House Model', price: 339.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
};

// Helper function to convert specific property size to range for pricing
export function getPropertySizeRange(size: string | number): string {
  let sizeNum: number;
  
  // If it's already a range format, return it if it matches our new format
  if (typeof size === 'string' && (size.includes('sq.ft.') || size.includes('sq ft'))) {
    // Convert old format to new format if needed
    if (size.includes('–') || size.includes('-')) {
      return size; // Assume it's already in correct format
    }
  }
  
  // Convert to number
  if (typeof size === 'string') {
    sizeNum = parseInt(size.replace(/[^0-9]/g, ''));
  } else {
    sizeNum = size;
  }
  
  // Convert number to appropriate range using new ranges
  if (sizeNum < 1500) return 'Under 1500 sq.ft.';
  if (sizeNum < 2500) return '1500-2499 sq.ft.';
  if (sizeNum < 3500) return '2500-3499 sq.ft.';
  if (sizeNum < 4500) return '3500-4499 sq.ft.';
  return '4500-5499 sq.ft.';
}

// Helper function to format property size for display
export function formatPropertySizeDisplay(size: string | number): string {
  if (!size) return 'Not specified';
  
  // If it's already a range format with sq.ft., return it
  if (typeof size === 'string' && size.includes('sq.ft.')) {
    return size;
  }
  
  // If it's an old range format, convert it
  if (typeof size === 'string' && (size.includes('–') || size.includes('-'))) {
    // Try to extract numbers and convert to new format
    const match = size.match(/(\d+)[–-](\d+)/);
    if (match) {
      const [, start, end] = match;
      const startNum = parseInt(start);
      const endNum = parseInt(end);
      const avgSize = (startNum + endNum) / 2;
      return getPropertySizeRange(avgSize);
    }
    return size; // Fallback to original if can't parse
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

// Volume discount helpers
export function getDiscountPercent(amount: number): number {
  if (amount >= 1100) return 17;
  if (amount >= 900) return 15;
  if (amount >= 700) return 12;
  if (amount >= 500) return 10;
  if (amount >= 350) return 5;
  if (amount >= 199.99) return 3;
  return 0;
}

export function calculateDiscountedTotal(amount: number) {
  const percent = getDiscountPercent(amount);
  const discount = +(amount * (percent / 100)).toFixed(2);
  return {
    percent,
    discount,
    final: +(amount - discount).toFixed(2)
  };
}

export function applyDiscount(total: number) {
  const { percent } = getDiscountInfo(total);
  return total * (1 - percent / 100);
}

export function getDiscountInfo(total: number) {
  if (total >= 1100) return { percent: 17, min: 1100, max: Infinity };
  if (total >= 900) return { percent: 15, min: 900, max: 1099.99 };
  if (total >= 700) return { percent: 12, min: 700, max: 899.99 };
  if (total >= 500) return { percent: 10, min: 500, max: 699.99 };
  if (total >= 350) return { percent: 5, min: 350, max: 499.99 };
  if (total >= 199.99) return { percent: 3, min: 199.99, max: 349.99 };
  return { percent: 0, min: 0, max: 199.98 };
}

// Helper function to calculate correct pricing for services including packages
export function calculateServicePricing(services: any[], propertySize: string | number) {
  const packageNames = Object.keys(PACKAGES);
  const propertySizeRange = getPropertySizeRange(propertySize);
  
  let totalPrice = 0;
  let packageServices: any[] = [];
  let individualServices: any[] = [];
  let allPackageIncludes: string[] = [];
  
  // Separate packages from individual services
  services.forEach((service: any) => {
    if (packageNames.includes(service.name)) {
      packageServices.push(service);
      const pkgInfo = PACKAGES[service.name]?.[propertySizeRange];
      if (pkgInfo) {
        totalPrice += pkgInfo.price * (service.count || 1);
        allPackageIncludes = allPackageIncludes.concat(pkgInfo.includes);
      }
    } else {
      individualServices.push(service);
    }
  });
  
  // Calculate pricing for individual services not included in packages
  individualServices.forEach((service: any) => {
    if (!allPackageIncludes.includes(service.name)) {
      totalPrice += (service.price || 0) * (service.count || 1);
    }
  });
  
  return {
    totalPrice,
    packageServices,
    individualServices: individualServices.filter(s => !allPackageIncludes.includes(s.name)),
    allPackageIncludes
  };
} 