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
    column: string,
    nameField: string = 'name'
): undefined | { id: string; name: string } => {
    console.log({ column, entities, nameField, text })
    const matchingEntity = entities.find((entity) => entity[nameField].trim() === text.trim())
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
    column: string,
    nameField: string = 'name'
) => {
    return text.split(',').reduce<{ id: string[]; name: string[] }>(
        (acc, option) => {
            const matchingEntity = parseMultiSelectText(option, entities, column, nameField)

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
            column: 'leaving',
            id: new Date(text).toISOString(),
        }
    } catch {
        return undefined
    }
}

const parseText = (text: string, column: string) => {
    return { column, id: text?.trim() }
}

export const overrideDataWithPastedRows = <Column extends string>({
    columns,
    data,
    defaultValues,
    initialColumnIndex,
    initialRowIndex,
    mappings,
    pastedRows,
}: {
    columns: Column[]
    data: Record<Column, any>[]
    defaultValues: Record<string, any>
    initialColumnIndex: number
    initialRowIndex: number
    mappings: Record<Column, (...params: any[]) => undefined | { id: string; name?: string }>
    pastedRows: Record<string, any>[]
}): Record<Column, any>[] => {
    const newData = [...data]

    rowLoop: for (
        let pastedRowIndex = 0, tableRowIndex = initialRowIndex;
        pastedRowIndex < pastedRows.length;
        pastedRowIndex++, tableRowIndex++
    ) {
        const pastedRow = pastedRows[pastedRowIndex]

        for (
            let pastedColumnIndex = 0, tableColumnIndex = initialColumnIndex;
            pastedColumnIndex < pastedRow.length;
            pastedColumnIndex++, tableColumnIndex++
        ) {
            const pastedCell = pastedRow[pastedColumnIndex]

            const targetTableColumn = columns[tableColumnIndex]

            if (!targetTableColumn) {
                continue rowLoop
            }

            // get column name if it was the displayName
            const column = targetTableColumn.split('_')[0] as Column

            const value = mappings[column]?.(pastedCell) ?? parseText(pastedCell, column)

            if (!value) {
                continue
            }

            // @ts-expect-error: Improve types
            newData[tableRowIndex] ??= { ...defaultValues }
            newData[tableRowIndex][column] = value.id

            if ('name' in value) {
                newData[tableRowIndex][targetTableColumn] = value.name
            }
        }
    }

    return newData
}
