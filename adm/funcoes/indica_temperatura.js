module.exports = (nascer_sol, por_sol, hora_atu, max, min, atu, chuva_neve) => {

    let status_temp = ":small_orange_diamond:"

    if (nascer_sol !== por_sol && (max !== min && min !== atu))
        if (hora_atu < nascer_sol || hora_atu > por_sol || chuva_neve.length > 0)
            status_temp = "`🔽`"
        else if ((hora_atu > nascer_sol && hora_atu < por_sol) && (max !== min && min !== atu))
            status_temp = "`🔼`"

    if (max === min && min === atu)
        status_temp = "`⏺️`"
        
    return status_temp
}