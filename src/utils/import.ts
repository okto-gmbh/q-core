const preParse = (text: string) =>
    text.replaceAll('\r', '').replace(/"([^"]*)\n([^"]*)"/g, '"$1\\n$2"')

const postParse = (text: string) => text.replace(/"([^"]*)\\n([^"]*)"/g, '$1 $2')

export const parseExcelTable = (text: string): string[][] => {
    const preParsedText = preParse(text)

    const rows = preParsedText.split(/(?<!\\)\n/)

    const data: string[][] = []

    for (let r = 0; r < rows.length; r++) {
        const row = rows[r]
        const columns = row.split('\t')

        for (let c = 0; c < columns.length; c++) {
            const column = columns[c]
            const postProcessedValue = postParse(column)

            data[r] ??= []
            data[r][c] = postProcessedValue
        }
    }

    return data
}

export const parseMultiSelectText = (
    text: string,
    entities: Record<string, any>[],
    nameField: string = 'name',
    creatorFunction?: (name: string) => void
): undefined | { id: string; name: string } => {
    const name = text.trim()
    const matchingEntity = entities.find((entity) => entity[nameField]?.trim() === name)

    if (!matchingEntity && creatorFunction) {
        creatorFunction(name)
        return { id: name, name }
    }

    return matchingEntity
        ? {
              id: matchingEntity?.id,
              name: matchingEntity?.[nameField],
          }
        : undefined
}

export const parseMultiArrayText = (
    text: string,
    entities: Record<string, any>[],
    nameField: string = 'name'
) => {
    return text.split(',').reduce<{ id: string[]; name: string[] }>(
        (acc, option) => {
            const matchingEntity = parseMultiSelectText(option, entities, nameField)

            if (!matchingEntity || acc.id.find((id) => id === matchingEntity.id)) {
                return acc
            }

            acc.id.push(matchingEntity.id)
            acc.name.push(matchingEntity.name)

            return acc
        },
        { id: [], name: [] }
    )
}

export const parseDate = (text: string) => {
    try {
        return {
            id: new Date(text).toISOString(),
        }
    } catch {
        return null
    }
}

export const parseText = (text: string) => {
    return { id: text?.trim() }
}

export type ColumnMappings<Columns extends string> = {
    [Column in Columns]?: (
        text: string,
        dataRowIndex: number,
        row: Record<Columns, string>
    ) => null | undefined | { id: string; name?: string } | { id: string[]; name?: string[] }
}

export const overrideDataWithPastedRows = <Columns extends string[]>({
    columns,
    data,
    defaultValues,
    initialColumnIndex,
    initialRowIndex,
    mappings,
    pastedRows,
}: {
    columns: Columns
    data: { [Column in keyof Columns]: string }[]
    defaultValues: Record<string, any>
    initialColumnIndex: number
    initialRowIndex: number
    mappings: ColumnMappings<Columns[number]>
    pastedRows: string[][]
}): {
    [Column in keyof Columns]: string
}[] => {
    const newData = structuredClone(data)

    rowLoop: for (
        let pastedRowIndex = 0, tableRowIndex = initialRowIndex;
        pastedRowIndex < pastedRows.length;
        pastedRowIndex++, tableRowIndex++
    ) {
        const pastedRow = pastedRows[pastedRowIndex]

        const row = columns.reduce<Record<Columns[number], string>>(
            (acc, column, currentColumnIndex) => ({
                ...acc,
                [column]: pastedRow[currentColumnIndex - initialColumnIndex],
            }),
            {} as Record<Columns[number], string>
        )

        for (
            let pastedColumnIndex = 0, tableColumnIndex = initialColumnIndex;
            pastedColumnIndex < pastedRow.length;
            pastedColumnIndex++, tableColumnIndex++
        ) {
            const targetTableColumn = columns[tableColumnIndex] as Columns[number]
            const pastedCell = row[targetTableColumn]

            if (!targetTableColumn) {
                continue rowLoop
            }

            // get column name if it was the displayName
            const column = targetTableColumn.split('_')[0] as Columns[number]

            const value =
                column in mappings
                    ? mappings[column]?.(pastedCell, tableRowIndex, row)
                    : parseText(pastedCell)

            if (!value) {
                continue
            }

            // @ts-expect-error: Improve types
            newData[tableRowIndex] ??= structuredClone(defaultValues)
            newData[tableRowIndex][column] = value.id

            if ('name' in value) {
                newData[tableRowIndex][targetTableColumn] = value.name
            }
        }
    }

    return newData
}
