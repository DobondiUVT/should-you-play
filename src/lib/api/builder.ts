export default class Builder {
    private queryFields: {
        where: string[];
        fields?: string;
        exclude?: string;
        sort?: string;
        limit?: string;
        offset?: string;
        search?: string;
    };

    private queryEndpoint: string;
    private queryName: string;
    private isMulti: boolean;
    public body: string;

    constructor() {
      this.queryFields = {
        where: [],
      };
      this.queryEndpoint = '';
      this.queryName = '';
      this.body = '';
      this.isMulti = false;
    }
  
    query(endpoint: string, name: string) {
      this.queryEndpoint = endpoint;
      this.queryName = name;
      return this;
    }
  
    fields(fields: string | readonly string[]) {
      if (fields) {
        let fieldsString = typeof fields === 'string' ? fields : fields.join(',');
        fieldsString = fieldsString ? fieldsString.replace(/\s/g, "") : "";
        this.queryFields.fields = `fields ${fieldsString}`;
      }
      return this;
    }
  
    exclude(exclude: string | readonly string[]) {
      if (exclude) {
        let excludeString = typeof exclude === 'string' ? exclude : exclude.join(',');
        excludeString = excludeString ? excludeString.replace(/\s/g, "") : "";
        this.queryFields.exclude = `exclude ${excludeString}`;
      }
      return this;
    }
  
    sort(field: string, direction?: 'asc' | 'desc') {
      if (field) {
        if (
          field.toLowerCase().endsWith(" desc") ||
          field.toLowerCase().endsWith(" asc")
        ) {
          this.queryFields.sort = `sort ${field}`;
        } else {
          this.queryFields.sort = `sort ${field} ${direction || "asc"}`;
        }
      }
      return this;
    }
  
    limit(limit: number) {
      if (limit) {
        this.queryFields.limit = `limit ${limit}`;
      }
      return this;
    }
  
    offset(offset: number) {
      if (offset) {
        this.queryFields.offset = `offset ${offset}`;
      }
      return this;
    }
  
    search(search: string) {
      if (search) {
        this.queryFields.search = `search "${search}"`;
      }
      return this;
    }
  
    where(filters: string | readonly string[]) {
      if (filters) {
        if (typeof filters === 'string') {
          this.queryFields.where.push(`where ${filters.trim()}`);
        } else {
          this.queryFields.where.push(`where ${filters.join(" & ")}`);
        }
      }
      return this;
    }
  
    build(): Builder {
      const { where, ...rest } = this.queryFields;
      this.body =
        Object.keys(this.queryFields).length > 1 ||
        this.queryFields.where.length > 1
          ? Object.values(rest).concat(where).join(";") + ";"
          : "";
      return this;
    }
  
    buildMulti(queries: Builder[]) {
      this.body = queries
        .map((q) => {
          const { queryEndpoint, queryName } = q;
  
          const body = q.build().body;
          return `query ${queryEndpoint} "${queryName}" { ${body} };`;
        })
        .join("");
      return this;
    }
  
    multi(queries: Builder[]) {
      this.isMulti = true;
      this.buildMulti(queries);
      return this;
    }
}