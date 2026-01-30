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
    feature_free: string;
    feature_online: string;
    feature_no_limits: string;
    feature_secure: string;
    dropzone_drag: string;
    dropzone_max_size: string;
    // Sign PDF
    sign_title: string;
    sign_description: string;
    sign_button: string;
    sign_add_elements: string;
    sign_signing: string;
    sign_signing_description: string;
    sign_success: string;
    sign_success_description: string;
    sign_download: string;
    sign_download_again: string;
    sign_another: string;
    sign_failed_load: string;
    sign_tab_draw: string;
    sign_tab_text: string;
    sign_tab_date: string;
    sign_apply_signature: string;
    sign_color_black: string;
    sign_color_dark_gray: string;
    sign_color_blue: string;
    sign_color_red: string;
    sign_color_green: string;
    sign_type_text: string;
    sign_text_preview: string;
    sign_apply: string;
    sign_pick_date: string;
    sign_format: string;
    sign_font: string;
    sign_select_date: string;
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
