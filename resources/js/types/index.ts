export type * from './auth';

import type { Auth } from './auth';

export type Translations = {
    welcome_on: string;
    home_description: string;
    choose_tool: string;
    tool_sign_pdf: string;
    tool_merge_pdf: string;
    tool_split_pdf: string;
    tool_compress_pdf: string;
    tool_convert_to_png: string;
    tool_convert_to_jpg: string;
    coming_soon: string;
    use_another_tool: string;
    all_rights_reserved: string;
    made_by: string;
};

export type Locale = 'en' | 'fr';

export type SharedData = {
    name: string;
    auth: Auth;
    locale: Locale;
    translations: Translations;
    [key: string]: unknown;
};
