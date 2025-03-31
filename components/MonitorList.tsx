import { MonitorState, MonitorTarget } from '@/uptime.types'
import { Accordion, Card, Center, Text } from '@mantine/core'
import MonitorDetail from './MonitorDetail'
import { pageConfig } from '@/uptime.config';

function countDownCount(state: MonitorState, ids: string[]) {
  let downCount = 0
  for (let id of ids) {
    if (state.incident[id] === undefined || state.incident[id].length === 0) {
      continue
    }

    if (state.incident[id].slice(-1)[0].end === undefined) {
      downCount++
    }
  }
  return downCount
}

function getStatusTextColor(state: MonitorState, ids: string[]) {
  let downCount = countDownCount(state, ids)
  if (downCount === 0) {
    return '#059669'
  } else if (downCount === ids.length) {
    return '#df484a'
  } else {
    return '#f29030'
  }
}

export default function MonitorList({ monitors, state }: { monitors: MonitorTarget[]; state: MonitorState }) {
  // @ts-ignore
  let group: any = pageConfig.group
  let groupedMonitor = group && Object.keys(group).length > 0
  let content
  
  if (groupedMonitor) {
    // Grouped monitors
    content = (
      <Accordion multiple defaultValue={Object.keys(group)} variant='contained'>
        {
          Object.keys(group).map(groupName => (
            <Accordion.Item key={groupName} value={groupName}>
              <Accordion.Control>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div>{groupName}</div>
                  <Text fw={500} style={{ display: 'inline', paddingRight: '5px', color: getStatusTextColor(state, group[groupName])}}>
                    {group[groupName].length - countDownCount(state, group[groupName])}
                    /{group[groupName].length} 可用
                  </Text>
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                {
                  monitors
                  .filter(monitor => group[groupName].includes(monitor.id))
                  .sort((a, b) => group[groupName].indexOf(a.id) - group[groupName].indexOf(b.id))
                  .map(monitor => (
                    <div key={monitor.id}>
                      <Card.Section ml="xs" mr="xs">
                        <MonitorDetail monitor={monitor} state={state} />
                      </Card.Section>
                    </div>
                  ))
                }
                </Accordion.Panel>
            </Accordion.Item>
          ))
        }
      </Accordion>
    )
  } else {
    // Ungrouped monitors
    content = monitors.map((monitor) => (
      <div key={monitor.id}>
        <Card.Section ml="xs" mr="xs">
          <MonitorDetail monitor={monitor} state={state} />
        </Card.Section>
      </div>
    ))
  }

  return (
    <Center>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        ml="xl"
        mr="xl"
        mt="xl"
        withBorder={!groupedMonitor}
        style={{ width: groupedMonitor ? '897px' : '865px' }}
      >
        {content}
      </Card>
    </Center>
  )
}
