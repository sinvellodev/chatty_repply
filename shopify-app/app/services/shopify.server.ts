/**
 * Servicio para interactuar con la API de Shopify
 * Proporciona funciones para obtener productos, clientes, etc.
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string;
  variants?: Array<{
    id: string;
    title: string;
    price: string;
    available: boolean;
  }>;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Obtiene productos de Shopify
 * @param admin - Cliente GraphQL de Shopify admin
 * @param limit - Número máximo de productos a devolver
 * @returns Array de productos
 */
export async function getProducts(
  admin: any,
  limit: number = 10
): Promise<ShopifyProduct[]> {
  try {
    const response = await admin.graphql(`
      query getProducts($limit: Int!) {
        products(first: $limit) {
          edges {
            node {
              id
              title
              description
              priceRangeV2 {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `, {
      variables: { limit }
    });

    const data = await response.json();

    if (!data?.data?.products?.edges) {
      return [];
    }

    return data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      price: edge.node.priceRangeV2.minVariantPrice.amount,
      image: edge.node.featuredImage?.url,
      variants: edge.node.variants.edges.map((v: any) => ({
        id: v.node.id,
        title: v.node.title,
        price: v.node.price,
        available: v.node.availableForSale
      }))
    }));
  } catch (error) {
    console.error("Error al obtener productos de Shopify:", error);
    return [];
  }
}

/**
 * Busca productos por término de búsqueda
 * @param admin - Cliente GraphQL de Shopify admin
 * @param query - Término de búsqueda
 * @returns Array de productos que coinciden
 */
export async function searchProducts(
  admin: any,
  query: string
): Promise<ShopifyProduct[]> {
  try {
    const response = await admin.graphql(`
      query searchProducts($query: String!) {
        products(first: 10, query: $query) {
          edges {
            node {
              id
              title
              description
              priceRangeV2 {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
              }
            }
          }
        }
      }
    `, {
      variables: { query }
    });

    const data = await response.json();

    if (!data?.data?.products?.edges) {
      return [];
    }

    return data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      price: edge.node.priceRangeV2.minVariantPrice.amount,
      image: edge.node.featuredImage?.url
    }));
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return [];
  }
}

/**
 * Obtiene información de un cliente
 * @param admin - Cliente GraphQL de Shopify admin
 * @param customerId - ID del cliente
 * @returns Información del cliente o null
 */
export async function getCustomer(
  admin: any,
  customerId: string
): Promise<ShopifyCustomer | null> {
  try {
    const response = await admin.graphql(`
      query getCustomer($id: ID!) {
        customer(id: $id) {
          id
          email
          firstName
          lastName
        }
      }
    `, {
      variables: { id: customerId }
    });

    const data = await response.json();

    if (!data?.data?.customer) {
      return null;
    }

    return {
      id: data.data.customer.id,
      email: data.data.customer.email,
      firstName: data.data.customer.firstName,
      lastName: data.data.customer.lastName
    };
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return null;
  }
}

/**
 * Formatea información de productos para el contexto del chatbot
 * @param products - Array de productos
 * @returns String formateado para el asistente
 */
export function formatProductsForContext(products: ShopifyProduct[]): string {
  if (products.length === 0) {
    return "No hay productos disponibles en este momento.";
  }

  return products.map((product, index) => {
    const variants = product.variants
      ? `\nVariantes: ${product.variants.map(v => `${v.title} - €${v.price}`).join(", ")}`
      : "";

    return `${index + 1}. ${product.title}
   Precio: €${product.price}
   Descripción: ${product.description}${variants}`;
  }).join("\n\n");
}

/**
 * Extrae términos relacionados con productos de una pregunta
 * @param question - Pregunta del usuario
 * @returns Array de términos de búsqueda
 */
export function extractProductKeywords(question: string): string[] {
  const keywords: string[] = [];
  const lowerQuestion = question.toLowerCase();

  // Palabras clave relacionadas con depilación láser
  const productTerms = [
    "depilación", "laser", "diodo", "sesión", "tratamiento",
    "zona", "cuerpo", "facial", "piernas", "axilas", "bikini",
    "precio", "costo", "paquete", "promoción"
  ];

  for (const term of productTerms) {
    if (lowerQuestion.includes(term)) {
      keywords.push(term);
    }
  }

  return keywords;
}
