export const slugify = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-')
}

export const unslugify = (slug: string) => {
    return slug.replace(/-/g, ' ')
}