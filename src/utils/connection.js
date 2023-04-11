export const connectionHelper = async (model, input) => {
  const { filter, limit, skip, sort } = input;
  const sortField = sort?.field || 'title';
  const sortOrder = sort?.order === 'DESC' ? -1 : 1;
  const sortQuery = { [sortField]: sortOrder };
  const limitQuery = limit ? limit : 10;
  const skipQuery = skip ? skip : 0;
  const filterQuery = buildQuery(filter);

  const nodes = await model
    .find(filterQuery)
    .limit(limitQuery)
    .skip(skipQuery)
    .sort(sortQuery);

  const totalCount = await model.countDocuments(filterQuery);
  const currentPage = Math.ceil(skipQuery / limitQuery) + 1;
  const pageCount = Math.ceil(totalCount / limitQuery);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage * limitQuery < totalCount;

  const pageInfo = {
    hasNextPage,
    hasPreviousPage,
    currentPage,
    itemCount: nodes.length,
    pageCount,
    perPage: limitQuery,
    totalCount,
  };

  return {
    nodes,
    pageInfo,
  };
};

const supportedOperators = [
  'eq',
  'contains',
  'ne',
  'exists',
  'gt',
  'gte',
  'lt',
  'lte',
];

export const buildQuery = (filter) => {
  const query = {};

  if (!filter) {
    return query;
  }

  for (const [field, operators] of Object.entries(filter)) {
    const supOp = Object.keys(operators).filter((op) => {
      return supportedOperators.includes(op);
    });

    if (supOp.length > 0) {
      const fieldQuery = {};
      const caseSensitive = operators.caseSensitive ?? false;

      supOp.forEach((operator) => {
        switch (operator) {
          case 'eq':
            if (caseSensitive) {
              fieldQuery.$eq = operators[operator];
            } else {
              fieldQuery.$regex = new RegExp(`^${operators[operator]}$`, 'i');
            }
            break;
          case 'ne':
            if (caseSensitive) {
              fieldQuery.$ne = operators[operator];
            } else {
              fieldQuery.$not = new RegExp(`^${operators[operator]}$`, 'i');
            }
            break;
          case 'exists':
            fieldQuery.$exists = operators[operator];
            break;
          case 'contains':
            fieldQuery.$regex = new RegExp(
              operators[operator],
              caseSensitive ? '' : 'i'
            );
            break;
          case 'gt':
            fieldQuery.$gt = operators[operator];
            break;
          case 'gte':
            fieldQuery.$gte = operators[operator];
            break;
          case 'lt':
            fieldQuery.$lt = operators[operator];
            break;
          case 'lte':
            fieldQuery.$lte = operators[operator];
            break;
          default:
            throw new Error(`Unsupported operator ${operator}`);
        }
      });

      query[field] = fieldQuery;
    } else if (field === 'and') {
      query.$and = operators.map((subfilter) => buildQuery(subfilter));
    } else if (field === 'or') {
      query.$or = operators.map((subfilter) => buildQuery(subfilter));
    } else {
      query[field] = operators;
    }
  }

  return query;
};
