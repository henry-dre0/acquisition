// ─────────────────────────────────────────────
//  FORMAT — Zod error formatting helper
// ─────────────────────────────────────────────
//  Converts Zod validation errors into a flat
//  comma-separated string for API responses.
// ─────────────────────────────────────────────

export const FormatValidationError = (errors) => {
    if(!errors || !errors.issues) return 'Validation Failed';
    
    if(Array.isArray(errors.issues)) return errors.issues.map(i => i.message).join(',');

    return JSON.stringify(errors);
        
};
