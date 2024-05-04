module.exports = (nascer_sol, por_sol, hora_atu, max, min, atu, chuva_neve) => {

    if (nascer_sol !== por_sol && (max !== min && min !== atu))
        if (hora_atu < nascer_sol || hora_atu > por_sol || chuva_neve.length > 0) return "`🔽`"
        else if ((hora_atu > nascer_sol && hora_atu < por_sol) && (max !== min && min !== atu)) return "`🔼`"

    if (max === min && min === atu) return "`⏺️`"

    return "🔸"
}