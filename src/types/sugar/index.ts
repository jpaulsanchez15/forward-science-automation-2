export type SugarAuth = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  refresh_expires_in: number;
  download_token: string;
};

export type SugarOffice = {
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  modified_user_link: {
    full_name: string;
    id: string;
    _acl: {
      fields: {
        pwd_last_changed: {
          write: string;
          create: string;
        };
        last_login: {
          write: string;
          create: string;
        };
      };
      _hash: string;
    };
  };
  created_by: string;
  created_by_name: string;
  created_by_link: {
    full_name: string;
    id: string;
    _acl: {
      fields: any[];
      _hash: string;
    };
  };
  description: string;
  deleted: boolean;
  facebook: string;
  twitter: string;
  googleplus: string;
  account_type: string;
  industry: string;
  annual_revenue: string;
  phone_fax: string;
  billing_address_street: string;
  billing_address_street_2: string;
  billing_address_street_3: string;
  billing_address_street_4: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_postalcode: string;
  billing_address_country: string;
  rating: string;
  phone_office: string;
  phone_alternate: string;
  website: string;
  ownership: string;
  employees: string;
  ticker_symbol: string;
  shipping_address_street: string;
  shipping_address_street_2: string;
  shipping_address_street_3: string;
  shipping_address_street_4: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_postalcode: string;
  shipping_address_country: string;
  service_level: string;
  parent_id: string;
  sic_code: string;
  duns_num: string;
  parent_name: string;
  member_of: {
    name: string;
    id: string;
    _acl: {
      fields: {
        dri_workflow_template_id: {
          create: string;
          write: string;
          license: string;
        };
        dri_workflow_template_name: {
          create: string;
          write: string;
          license: string;
        };
      };
      _hash: string;
    };
  };
  business_center_name: string;
  business_centers: {
    name: string;
    id: string;
    _acl: {
      fields: any[];
      _hash: string;
    };
  };
  business_center_id: string;
  campaign_id: string;
  campaign_name: string;
  campaign_accounts: {
    name: string;
    id: string;
    _acl: {
      fields: any[];
      _hash: string;
    };
  };
  next_renewal_date: string;
  widget_next_renewal_date: string;
  hint_account_size: string;
  hint_account_industry: string;
  hint_account_location: string;
  hint_account_industry_tags: string;
  hint_account_founded_year: string;
  hint_account_facebook_handle: string;
  hint_account_logo: string;
  hint_account_pic: string;
  hint_account_naics_code_lbl: string;
  hint_account_fiscal_year_end: string;
  geocode_status: string;
  following: boolean;
  my_favorite: boolean;
  tag: {
    id: string;
    name: string;
  }[];
  locked_fields: any[];
  sync_key: string;
  assigned_user_id: string;
  assigned_user_name: string;
  assigned_user_link: {
    full_name: string;
    id: string;
    _acl: {
      fields: any[];
      _hash: string;
    };
  };
  team_count: string;
  team_count_link: {
    team_count: string;
    id: string;
    _acl: {
      fields: any[];
      _hash: string;
    };
  };
  team_name: {
    id: string;
    name: string;
    name_2: string;
    primary: boolean;
    selected: boolean;
  }[];
  email: {
    email_address: string;
    primary_address: boolean;
    reply_to_address: boolean;
    invalid_email: boolean;
    opt_out: boolean;
    email_address_id: string;
  }[];
  email1: string;
  email2: string;
  invalid_email: boolean;
  email_opt_out: boolean;
  email_addresses_non_primary: string;
  is_escalated: boolean;
  npi_c: string;
  tracking_number_c: string;
  custom_etch_c: string;
  dea_number_c: string;
  serial_number_c: string;
  instagram_c: string;
  sub_office_source_c: string;
  office_source_c: string;
  customer_type_c: string[];
  serial_number_new_c: string;
  sales_rep_id_c: string;
  sales_rep_name_c: string;
  account_source_c: string;
  _acl: {
    fields: any;
  };
  _module: string;
};
