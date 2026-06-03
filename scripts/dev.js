const { spawn } = require('child_process');

const processes = [
  { name: 'backend', command: 'npm', args: ['run', 'dev', '--prefix', 'backend'] },
  { name: 'frontend', command: 'npm', args: ['run', 'dev', '--prefix', 'frontend'] },
];

const runningProcesses = processes.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exitCode = code;
      for (const otherProcess of runningProcesses) {
        if (otherProcess !== child && !otherProcess.killed) {
          otherProcess.kill();
        }
      }
    }
  });

  return child;
});

process.on('SIGINT', () => {
  for (const child of runningProcesses) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }
  process.exit(0);
});
